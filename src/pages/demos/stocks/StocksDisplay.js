import { Grid } from '@material-ui/core';
import StockCard from './components/StockCard';
import StockInput from './components/StockInput';
import PropTypes from 'prop-types'

function StocksDisplay({ stocks, onAddToFeed, onRemoveFromFeed }) {

    return (
        <>
            <StockInput onStockAdded={onAddToFeed} />

            <Grid container spacing={3}>
                {
                    stocks
                        .sort((a, b) => b.key < a.key ? 1 : -1)
                        .map(x => {
                            console.log('HELLO HELLO', x);
                            return x;
                        })
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

StocksDisplay.propTypes = {
    stocks: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
        hasTradeRecorded: PropTypes.bool.isRequired,
        change: PropTypes.number.isRequired
    })).isRequired,
    onAddToFeed: PropTypes.func.isRequired,
    onRemoveFromFeed: PropTypes.func.isRequired
}

export default StocksDisplay
