import { Grid } from '@material-ui/core';
import { memo } from 'react';
import StockCard from './components/StockCard';
import StockInput from './components/StockInput';

function StocksDisplay({ stocks, onAddToFeed, onRemoveFromFeed }) {

    return (
        <>
            <StockInput onStockAdded={onAddToFeed} />

            <Grid container spacing={3}>
                {
                    stocks
                        .sort((a, b) => b.key < a.key ? 1 : -1)
                        .map(stock => (
                            <Grid key={stock.key} item xs={3}>
                                <StockCard stock={stock} onUnsubscribe={onRemoveFromFeed} />
                            </Grid>
                        ))
                }
            </Grid>
        </>
    )
}

export default memo(StocksDisplay)
