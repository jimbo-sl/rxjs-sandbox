import { Button, Grid, makeStyles, TextField } from '@material-ui/core';
import { useEffect, useRef, useState } from 'react';
import { debounceTime, filter, map, pluck, scan } from 'rxjs/operators';
import { webSocket } from 'rxjs/webSocket';
import StockCard from './components/StockCard';

const useStyles = makeStyles((theme) => ({
    btn: {
        marginRight: theme.spacing(2),
        marginBottom: theme.spacing(2),
        marginTop: theme.spacing(2)
    }
}));

const obs$ = webSocket('wss://ws.finnhub.io?token=c2lrsuqad3ice2ned680');

function WebSocket() {
    const classes = useStyles();

    const [state, setState] = useState({});
    const [activeStockKeys, _setActiveStockKeys] = useState([]);
    const [stockName, _setStockName] = useState('');

    const stockNameRef = useRef(stockName)

    const setStockName = state => {
        stockNameRef.current = state;
        _setStockName(state);
    }

    const activeStockKeysRef = useRef(activeStockKeys)

    const setActiveStockKeys = state => {
        console.log('keys', state)
        activeStockKeysRef.current = state;
        _setActiveStockKeys(state);
    }

    useEffect(() => {
        const sub = obs$
            .pipe(
                debounceTime(250),
                filter(v => v.type === 'trade'),
                pluck('data'),
                map(data => data.reduce((acc, curr) => ({
                    ...acc,
                    [curr.s]: curr.p
                }), {})),
                scan((acc, curr) => ({
                    ...acc,
                    ...Object.keys(curr).reduce((obj, key) => ({
                        ...obj,
                        [key]: {
                            key,
                            value: curr[key],
                            change: acc.hasOwnProperty(key)
                                ? curr[key] - acc[key].value
                                : 0
                        }
                    }), {})
                }), {})
            )
            .subscribe({
                next: setState,
                error: console.log
            });

        return () => {
            sub.unsubscribe();
        }
    }, [])

    const onAddToFeed = () => {
        obs$.next({ type: "subscribe", symbol: stockNameRef.current });
        setActiveStockKeys([...activeStockKeysRef.current, stockNameRef.current])
    }

    const onUnsubscribe = (key) => {

        setActiveStockKeys(activeStockKeysRef.current.filter(x => x !== key));
        obs$.next({ type: "unsubscribe", symbol: key });

        const { [key]: value, ...withoutProp } = state;

        setState(withoutProp);
    }

    return (
        <>
            <form>
                <TextField label="Stock" onChange={(e) => setStockName(e.currentTarget.value)} />
            </form>

            <Button className={classes.btn} variant="contained" color="primary" onClick={onAddToFeed}>Add to feed</Button>

            <Grid container spacing={3}>
                {
                    Object.keys(state)
                        .filter(key => activeStockKeysRef.current.includes(key))
                        .map(key => (
                            <Grid key={key} item xs={3}>
                                <StockCard stock={state[key]} onUnsubscribe={onUnsubscribe} />
                            </Grid>
                        ))
                }
            </Grid>
        </>
    )
}

export default WebSocket
