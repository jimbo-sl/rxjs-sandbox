import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import roles from './constants/stocks-element-roles';
import { getAllByRole, getByRole, queryByRole } from "@testing-library/dom";
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
    let mockWebSocket$;
    let socketSpy;
    let subscribeToStockSpy;
    let unsubscribeFromStockSpy;

    beforeEach(() => {
        mockWebSocket$ = new Subject();
        socketSpy = jest.spyOn(socketWrapper, "socket$").mockReturnValue(mockWebSocket$);
        subscribeToStockSpy = jest.spyOn(service, 'subscribeToStock');
        unsubscribeFromStockSpy = jest.spyOn(service, 'unsubscribeFromStock');
    })

    afterEach(() => {
        socketSpy.mockRestore();
        subscribeToStockSpy.mockRestore();
        unsubscribeFromStockSpy.mockRestore();
    })

    const enterStockAndSubmit = (stock) => {
        const input = getByRole(container, roles.stockNameInput);
        const btn = getByRole(container, roles.addToFeedButton);

        fireEvent.change(input, { target: { value: stock } });
        fireEvent.click(btn);
    }

    const receiveTrade = trade => receiveTrades(trade);

    const receiveTrades = (...trades) => {
        act(() => {
            trades.forEach(trade => {
                mockWebSocket$.next({
                    data: [
                        {
                            "p": trade.value,
                            "s": trade.stockName
                        }
                    ],
                    type: "trade"
                })
            });
        })
    }

    describe('when adding stock via input', () => {

        it('should send value to websocket', done => {
            const stockName = 'AAA';

            const sub = mockWebSocket$.subscribe(x => {
                expect(x.symbol).toEqual(stockName);
                sub.unsubscribe();
                done();
            });

            act(() => {
                render(<Stocks />, container);
            });

            enterStockAndSubmit(stockName);

            expect(subscribeToStockSpy).toHaveBeenCalledTimes(1);
            expect(subscribeToStockSpy).toHaveBeenCalledWith(stockName);
        })

        it('should display the stock with no trade value', () => {
            const stockName = 'BBB';

            act(() => {
                render(<Stocks />, container);
            });

            enterStockAndSubmit(stockName);

            expect(getByRole(container, roles.stockNameText)).toHaveTextContent(stockName)
        })
    })

    describe('when receiving trades', () => {

        describe('when receiving first trade', () => {
            it('should display the stock value', () => {
                const stockName = 'CCC';
                const stockValue = 1;

                act(() => {
                    render(<Stocks />, container);
                });

                enterStockAndSubmit(stockName);

                receiveTrade({
                    stockName: stockName,
                    value: stockValue
                })

                expect(getByRole(container, roles.stockNameText)).toHaveTextContent(stockName)
                expect(getByRole(container, roles.stockValueText)).toHaveTextContent(stockValue)
            })
        })

        describe('when next trade is of existing stock', () => {
            describe('when stock value has increased', () => {
                it('should display the new stock value and correct change icon', () => {
                    const stockName = 'DDD';
                    const initialStockValue = 1;
                    const finalStockValue = 2;

                    act(() => {
                        render(<Stocks />, container);
                    });

                    enterStockAndSubmit(stockName);

                    receiveTrades(
                        {
                            stockName: stockName,
                            value: initialStockValue
                        },
                        {
                            stockName: stockName,
                            value: finalStockValue
                        }
                    )

                    expect(getByRole(container, roles.stockNameText)).toHaveTextContent(stockName)
                    expect(getByRole(container, roles.stockValueText)).toHaveTextContent(finalStockValue)
                    expect(getByRole(container, roles.stockValueIncreased)).toBeInTheDocument()
                })
            })

            describe('when stock value has decreased', () => {
                it('should display the new stock value and correct change icon', () => {
                    const stockName = 'DDD';
                    const initialStockValue = 2;
                    const finalStockValue = 1;

                    act(() => {
                        render(<Stocks />, container);
                    });

                    enterStockAndSubmit(stockName);

                    receiveTrades(
                        {
                            stockName: stockName,
                            value: initialStockValue
                        },
                        {
                            stockName: stockName,
                            value: finalStockValue
                        }
                    )

                    expect(getByRole(container, roles.stockNameText)).toHaveTextContent(stockName)
                    expect(getByRole(container, roles.stockValueText)).toHaveTextContent(finalStockValue)
                    expect(getByRole(container, roles.stockValueDecreased)).toBeInTheDocument()
                })
            })
        })

        describe('when next trade is of new stock', () => {
            it('should display both stocks', () => {
                const stockOneName = 'AAA';
                const stockOneValue = 1;

                const stockTwoName = 'BBB';
                const stockTwoValue = 2;

                act(() => {
                    render(<Stocks />, container);
                });

                enterStockAndSubmit(stockOneName);
                enterStockAndSubmit(stockTwoName);

                receiveTrades(
                    {
                        stockName: stockOneName,
                        value: stockOneValue
                    },
                    {
                        stockName: stockTwoName,
                        value: stockTwoValue
                    }
                )

                const stockNameElements = getAllByRole(container, roles.stockNameText)
                expect(stockNameElements[0]).toHaveTextContent(stockOneName)
                expect(stockNameElements[1]).toHaveTextContent(stockTwoName)

                const stockValueElements = getAllByRole(container, roles.stockValueText)
                expect(stockValueElements[0]).toHaveTextContent(stockOneValue)
                expect(stockValueElements[1]).toHaveTextContent(stockTwoValue)
            })
        })
    })


    describe('when removing stock from feed', () => {

        it('should remove stock from display', () => {
            const stockName = 'XXX';

            act(() => {
                render(<Stocks />, container);
            });

            enterStockAndSubmit(stockName);

            receiveTrade({
                stockName,
                value: 1
            })

            const unsubscribeBtn = getByRole(container, roles.removeFromFeedButton);
            fireEvent.click(unsubscribeBtn);

            const stockTitle = queryByRole(container, roles.stockNameText);
            expect(stockTitle).not.toBeInTheDocument();
        })
    })
});
