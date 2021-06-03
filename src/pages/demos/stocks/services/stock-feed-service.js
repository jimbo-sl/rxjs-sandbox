import { combineLatest, Subject } from 'rxjs';
import { debounceTime, filter, map, mergeWith, pluck, scan, tap } from 'rxjs/operators';
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
    }, []),
    map(keys => ({
        type: 'keys',
        data: keys
    }))
)

const stockFeed$ = connection$
    .pipe(
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
        ]), []),
        map(stocks => ({
            type: 'stocks',
            data: stocks
        }))
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

    getFeed$: () => keys$.pipe(
        mergeWith(stockFeed$),
        tap(console.log),
        scan((acc, val) => ({
            ...acc,
            [val.type]: val.data
        }), {}),
        scan((acc, { keys, stocks }) => keys.map(key => {
            const existing = acc.find(x => x.key === key);

            if (stocks == null) {
                return existing || {
                    key,
                    hasTradeRecorded: false
                }
            }

            const stock = stocks.find(x => x.key === key);

            return stock != null
                ? stock
                : existing || {
                    key,
                    hasTradeRecorded: false
                }
        }), [])
    )
}

export default service;