import { useEffect, useState } from "react";
import { interval } from "rxjs";
import { map, scan, startWith, takeWhile } from "rxjs/operators";
import createEventStore from '../../services/event-store'; 

const INTERVAL = 100;

const innerObservableFn = id => interval(INTERVAL).pipe(
    startWith(0),
    takeWhile(progress => progress <= 100),
    map(progress => ({
        id,
        progress
    }))
)

const withFlatteningStrategy = (flatteningFn) => WrappedComponent => (props) => {
    const [state, setState] = useState({});
    const [store, setStore] = useState({});

    useEffect(() => {
        const newStore = createEventStore()

        setStore(newStore);

        const sub = newStore.stream$.pipe(
            flatteningFn(({ id }) =>
                innerObservableFn(id)
            ),
            scan(
                (acc, curr) => ({
                    ...acc,
                    [curr.id]: curr.progress
                }),
                {}
            )
        ).subscribe(setState);

        return () => {
            sub.unsubscribe();
        }

    }, [])

    const onTrigger = () => {
        store.triggerEvent({ id: Object.keys(state).length + 1 });
    };

    const onComplete = () => {
        store.complete();
    };

    return (
        <WrappedComponent obj={state} onTrigger={onTrigger} onComplete={onComplete} {...props}/>
    )
}

export default withFlatteningStrategy;