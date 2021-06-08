import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import StocksDisplay from "./StocksDisplay";
import roles from './constants/stocks-element-roles';
import { getByRole } from "@testing-library/dom";
import { fireEvent } from "@testing-library/dom";

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

const renderStocksDisplay = (stocks, onAdd, onRemove) => act(() => {
    render(
        <StocksDisplay
            stocks={stocks}
            onAddToFeed={onAdd}
            onRemoveFromFeed={onRemove}
        />,
        container
    );
});

describe('StocksDisplay', () => {
    const onAdd = jest.fn();
    const onRemove = jest.fn();

    describe('add stock', () => {
        beforeEach(() => {
            renderStocksDisplay([], onAdd, onRemove);
        })

        it('sends input value to onAddToFeed callback on button click', () => {
            const input = getByRole(container, roles.stockNameInput);
            const btn = getByRole(container, roles.addToFeedButton);

            fireEvent.change(input, { target: { value: 'STOCK' } });
            fireEvent.click(btn);

            expect(onAdd).toHaveBeenCalledTimes(1);
            expect(onAdd).toHaveBeenCalledWith('STOCK');
        })
    })

    describe('remove stock', () => {
        const stock = {
            key: 'STOCK',
            value: 100,
            hasTradeRecorded: false,
            change: 0
        }

        beforeEach(() => {
            renderStocksDisplay([stock], onAdd, onRemove);
        })

        it('sends stock name to onRemove on button click', () => {
            const btn = getByRole(container, roles.removeFromFeedButton);

            fireEvent.click(btn);

            expect(onRemove).toHaveBeenCalledTimes(1);
            expect(onRemove).toHaveBeenCalledWith('STOCK');
        })
    })

});