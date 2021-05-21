import { Button, makeStyles } from "@material-ui/core";
import { useEffect, useState } from "react";
import { interval } from "rxjs";
import { concatMap, map, scan, startWith, takeWhile } from "rxjs/operators";
import createEventStore from '../../services/event-store';
import ProgressBars from "../../components/ProgressBars";

const useStyles = makeStyles((theme) => ({
    btn: {
        marginRight: theme.spacing(2)
    }
}));

const INTERVAL = 100;

const store = createEventStore()

const observable$ = store.stream$.pipe(
    concatMap(({ id }) =>
        interval(INTERVAL).pipe(
            startWith(0),
            takeWhile(progress => progress <= 100),
            map(progress => ({
                id,
                progress
            }))
        )
    ),
    scan(
        (acc, curr) => ({
            ...acc,
            [curr.id]: curr.progress
        }),
        {}
    ),
    map(obj => Object.keys(obj).map(key => ({
        id: key,
        progress: obj[key]
    })))
)

const ConcatMap = () => {
    const classes = useStyles();

    const [state, setState] = useState([]);
    const [count, setCount] = useState(0);

    useEffect(() => {
        const sub = observable$.subscribe(setState);

        return () => {
            sub.unsubscribe();
        }
    }, [])

    const onTriggerClick = () => {
        setCount(count + 1)
        store.triggerEvent({ id: count + 1 });
    };

    const onCompleteClick = () => {
        store.complete();
    };

    return (
        <>
            <ProgressBars bars={state} />

            <Button className={classes.btn} variant="contained" color="primary" onClick={onTriggerClick}>Trigger Outer Observable!</Button>
            <Button className={classes.btn} variant="contained" color="secondary" onClick={onCompleteClick}>Complete Outer Observable!</Button>
        </>
    );
}

export default ConcatMap;
