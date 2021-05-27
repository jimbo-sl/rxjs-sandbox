import { Button, Card, CardContent, makeStyles } from "@material-ui/core";
import { useEffect, useRef, useState } from "react";
import { interval } from "rxjs";
import { share, startWith, takeWhile } from "rxjs/operators";
import ProgressBar from "../../../components/ProgressBar";

const useStyles = makeStyles((theme) => ({
    btn: {
        marginRight: theme.spacing(2),
        marginBottom: theme.spacing(2)
    }
}));

const cold$ = interval(500).pipe(
    startWith(0),
    takeWhile(x => x <= 100)
);

const hot$ = cold$.pipe(
    share()
);

const Share = () => {
    const classes = useStyles();

    const [coldState, _setColdState] = useState({});
    const coldStateRef = useRef(coldState);

    const setColdState = state => {
        coldStateRef.current = state;
        _setColdState(state);
    }

    const [hotState, _setHotState] = useState({});
    const hotStateRef = useRef(hotState);

    const setHotState = state => {
        hotStateRef.current = state;
        _setHotState(state);
    }

    useEffect(() => {
        const sub1 = cold$.subscribe(v => {
            setColdState({
                ...coldStateRef.current,
                0: v
            });
        });

        const sub2 = hot$.subscribe(v => {
            setHotState({
                ...hotStateRef.current,
                0: v
            });
        });

        return () => {
            sub1.unsubscribe();
            sub2.unsubscribe();
        }
    }, [])

    const onColdSubscribe = () => {
        const id = Object.keys(coldStateRef.current).length;

        cold$.subscribe(v => {
            setColdState({
                ...coldStateRef.current,
                [id]: v
            });
        });
    }

    const onHotSubscribe = () => {
        const id = Object.keys(hotStateRef.current).length;

        hot$.subscribe(v => {
            setHotState({
                ...hotStateRef.current,
                [id]: v
            });
        });
    }

    return (
        <>
            <h2>share</h2>

            <Card variant="outlined">
                <CardContent>
                    <p>
                        Without the share operator, a new observable will start from scratch with every subscription.
                    </p>

                    <Button className={classes.btn} variant="contained" color="primary" onClick={onColdSubscribe}>Subscribe!</Button>

                    <h3>Initial Subscription</h3>
                    <ProgressBar value={coldStateRef.current[0]} />

                    <h3>Further Subscriptions</h3>
                    {
                        Object.keys(coldStateRef.current)
                            .filter(key => parseInt(key) > 0)
                            .map(key => (
                                <ProgressBar key={key} value={coldStateRef.current[key]} />
                            ))
                    }

                </CardContent>
            </Card>

            <br />

            <Card variant="outlined">
                <CardContent>
                    <p>
                        With the share operator, the same observable will be subscribed to.
                    </p>

                    <Button className={classes.btn} variant="contained" color="primary" onClick={onHotSubscribe}>Subscribe!</Button>

                    <h3>Initial Subscription</h3>
                    <ProgressBar value={hotStateRef.current[0]} />

                    <h3>Further Subscriptions</h3>
                    {
                        Object.keys(hotStateRef.current)
                            .filter(key => parseInt(key) > 0)
                            .map(key => (
                                <ProgressBar key={key} value={hotStateRef.current[key]} />
                            ))
                    }

                </CardContent>
            </Card>
        </>
    )
}

export default Share;