import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import roles from './constants/stocks-element-roles';
import { getByRole } from "@testing-library/dom";
import { fireEvent } from "@testing-library/dom";
import { Subject } from "rxjs";
import service from './services/stock-feed-service';
import Stocks from "./Stocks";
import { socketWrapper } from "../../../services/web-socket-client";

let container = null;
beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
});

afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});

describe('Stocks', () => {
    let fakeSocket$;
    let socketSpy;
    let subscribeToStockSpy;
    let unsubscribeFromStockSpy;

    beforeEach(() => {
        fakeSocket$ = new Subject();
        socketSpy = jest.spyOn(socketWrapper, "socket$").mockReturnValue(fakeSocket$);
        subscribeToStockSpy = jest.spyOn(service, 'subscribeToStock');
        unsubscribeFromStockSpy = jest.spyOn(service, 'unsubscribeFromStock');
    })

    afterEach(() => {
        socketSpy.mockRestore();
        subscribeToStockSpy.mockRestore();
        unsubscribeFromStockSpy.mockRestore();
    })

    describe('add stock via input', () => {

        const enterStockAndSubmit = (stock) => {
            const input = getByRole(container, roles.stockNameInput);
            const btn = getByRole(container, roles.addToFeedButton);

            fireEvent.change(input, { target: { value: stock } });
            fireEvent.click(btn);
        }

        it('sends input value to feed service', () => {
            act(() => {
                render(<Stocks />, container);
            });

            enterStockAndSubmit('AAA');

            expect(subscribeToStockSpy).toHaveBeenCalledTimes(1);
            expect(subscribeToStockSpy).toHaveBeenCalledWith('AAA');
        })

        it('pushes value to websocket', done => {
            const sub = fakeSocket$.subscribe(x => {
                expect(x.symbol).toEqual('BBB');
                sub.unsubscribe();
                done();
            });

            act(() => {
                render(<Stocks />, container);
            });

            enterStockAndSubmit('BBB');
        })
    })
});
