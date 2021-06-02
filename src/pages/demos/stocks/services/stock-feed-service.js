import { combineLatest, Subject } from 'rxjs';
import { debounceTime, filter, map, pluck, scan } from 'rxjs/operators';
import { webSocket } from 'rxjs/webSocket';

const connection$ = webSocket('wss://ws.finnhub.io?token=c2lrsuqad3ice2ned680');
const stockKeyActions$ = new Subject();

const keys$ = stockKeyActions$.pipe(
    scan((arr, action) => {
        if (action.type === 'subscribe') {
            arr = [...arr, action.stock]
        } else {
            arr = arr.filter(x => x !== action.stock)
        }
        return arr;
    }, [])
)

keys$.subscribe(console.log)

const stockFeed$ = connection$
    .pipe(
        debounceTime(250),
        filter(v => v.type === 'trade'),
        pluck('data'),
        map(data => data.reduce((acc, curr) => ([
            ...acc.filter(x => x.key !== curr.s),
            {
                key: curr.s,
                value: curr.p
            }
        ]), [])),
        scan((acc, curr) => ([
            ...acc.filter(stock => !curr.map(x => x.key).includes(stock.key)),
            ...curr.map(stock => {

                const existing = acc.find(x => x.key === stock.key);

                return {
                    ...stock,
                    hasTradeRecorded: true,
                    change: existing != null
                        ? stock.value - existing.value
                        : 0
                }
            })
        ]), [])
    );

const service = {
    subscribeToStock: (stock) => {
        stockKeyActions$.next({ type: 'subscribe', stock })
        connection$.next({ type: 'subscribe', symbol: stock });
    },

    unsubscribeFromStock: (stock) => {
        stockKeyActions$.next({ type: 'unsubscribe', stock })
        connection$.next({ type: 'unsubscribe', symbol: stock });
    },

    getFeed$: () => combineLatest([keys$, stockFeed$]).pipe(
        map(([keys, stocks]) => keys.map(key => {
            const stock = stocks.find(x => x.key === key);

            return stock != null
                ? stock
                : {
                    key,
                    hasTradeRecorded: false
                }
        }))
    )
}

export default service;