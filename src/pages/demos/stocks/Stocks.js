import { Grid } from '@material-ui/core';
import { useEffect, useRef, useState } from 'react';
import { debounceTime, filter, map, pluck, scan, tap } from 'rxjs/operators';
import { webSocket } from 'rxjs/webSocket';
import StockCard from './components/StockCard';
import StockInput from './components/StockInput';

const obs$ = webSocket('wss://ws.finnhub.io?token=c2lrsuqad3ice2ned680');

function Stocks() {

    const [stocks, setStocks] = useState([]);
    const [activeStockKeys, _setActiveStockKeys] = useState([]);

    const activeStockKeysRef = useRef(activeStockKeys)

    const setActiveStockKeys = val => {
        console.log('keys', val)
        activeStockKeysRef.current = val;
        _setActiveStockKeys(val);
    }

    useEffect(() => {
        const sub = obs$
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
                            change: existing != null
                                ? stock.value - existing.value
                                : 0
                        }
                    })
                ]), []),
                map(stocks => stocks.filter(stock => activeStockKeysRef.current.includes(stock.key)))
            )
            .subscribe({
                next: stocks => {
                    setStocks(stocks)
                    console.log({ stocks })
                },
                error: console.log
            });

        return () => {
            sub.unsubscribe();
        }
    }, [])

    const onAddToFeed = (stock) => {
        obs$.next({ type: "subscribe", symbol: stock });
        setActiveStockKeys([...activeStockKeys, stock])
    }

    const onUnsubscribe = (key) => {
        obs$.next({ type: "unsubscribe", symbol: key });
        setActiveStockKeys(activeStockKeys.filter(x => x !== key));
    }

    return (
        <>
            <StockInput onStockAdded={onAddToFeed} />

            <Grid container spacing={3}>
                {
                    stocks.map(stock => (
                        <Grid key={stock.key} item xs={3}>
                            <StockCard stock={stock} onUnsubscribe={onUnsubscribe} />
                        </Grid>
                    ))
                }
            </Grid>
        </>
    )
}

export default Stocks
