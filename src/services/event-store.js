import { Subject } from 'rxjs';

const createEventStore = () => {
    const subject = new Subject();

    return {
        stream$: subject,
        triggerEvent: (e) => subject.next(e),
        complete: () => subject.complete()
    }
}

export default createEventStore;