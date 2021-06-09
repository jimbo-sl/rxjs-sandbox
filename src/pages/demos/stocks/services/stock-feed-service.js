import { Subject } from 'rxjs';
import { filter, map, mergeWith, pluck, scan, tap } from 'rxjs/operators';
import { socketWrapper } from '../../../../services/web-socket-client';

let connection$ = null;
const stockKeyActions$ = new Subject();

const service = {
    subscribeToStock: (stock) => {
        openConnectionIfNecessary();

        stockKeyActions$.next({ type: 'subscribe', stock })
        connection$.next({ type: 'subscribe', symbol: stock });
    },

    unsubscribeFromStock: (stock) => {
        openConnectionIfNecessary();

        stockKeyActions$.next({ type: 'unsubscribe', stock })
        connection$.next({ type: 'unsubscribe', symbol: stock });
    },

    closeConnection() {
        if (connection$ != null) {
            connection$.complete();
            connection$ = null;
        }
    },

    getFeed$: () => {

        openConnectionIfNecessary();

        const keys$ = mapToKeyArray(stockKeyActions$);
        const stockFeed$ = mapToStockFeed(connection$);

        return keys$.pipe(
            mergeWith(stockFeed$),
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
}

const createConnection = () => {
    return socketWrapper.socket$('wss://ws.finnhub.io?token=c2lrsuqad3ice2ned680');
}

const openConnectionIfNecessary = () => {
    if (connection$ == null) {
        connection$ = createConnection();
    }
}

const mapToKeyArray = actions$ => actions$.pipe(
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

const mapToStockFeed = (data$) => data$
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

export default service;
