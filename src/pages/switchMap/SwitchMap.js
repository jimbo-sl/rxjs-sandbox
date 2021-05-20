import { Button, makeStyles } from '@material-ui/core'
import { useEffect, useState } from 'react'
import { combineLatest, interval, Subject } from 'rxjs'
import { map, scan, startWith, takeWhile, switchMap } from 'rxjs/operators';
import ProgressBar from '../../components/ProgressBar';

const useStyles = makeStyles((theme) => ({
    btn: {
        marginRight: theme.spacing(2)
    }
}));

const switch$ = new Subject();

const progress$ = switch$.pipe(
    switchMap(() =>
        interval(1000).pipe(
            startWith(0),
            takeWhile(v => v <= 100)
        )
    )
);

const observable$ = combineLatest([switch$, progress$]).pipe(
    map(([{ id }, progress]) => ({
        id,
        progress
    })),
    scan((acc, curr) => ({
        ...acc,
        [curr.id]: curr.progress
    }), {})
)

function SwitchMap() {
    const classes = useStyles();
    const [state, setState] = useState({});

    useEffect(() => {
        const sub = observable$.subscribe(setState)

        return () => {
            sub.unsubscribe();
        }

    }, [])

    const onSwitchClick = () => {
        switch$.next({ id: Object.keys(state).length + 1 });
    };

    const onCompleteClick = () => {
        switch$.complete();
    };

    return (
        <>
            {
                Object.keys(state).map(key => (
                    <ProgressBar key={key} value={state[key]} />
                ))
            }
            <Button className={classes.btn} variant="contained" color="primary" onClick={onSwitchClick}>Trigger Outer Observable!</Button>
            <Button className={classes.btn} variant="contained" color="secondary" onClick={onCompleteClick}>Complete Outer Observable!</Button>
        </>
    )
}

export default SwitchMap
