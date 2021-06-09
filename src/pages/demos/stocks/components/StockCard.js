import { Button, Card, CardContent, makeStyles } from '@material-ui/core'
import React, { memo, useCallback } from 'react'
import StockValue from './StockValue';
import StockWaiting from './StockWaiting';
import roles from '../constants/stocks-element-roles';
import PropTypes from 'prop-types'

const useStyles = makeStyles((theme) => ({
    stockTitle: {
        display: 'block',
        fontWeight: 700,
        marginBottom: theme.spacing(2)
    },
    buttonContainer: {
        display: 'block',
        marginTop: theme.spacing(2)
    }
}));

const StockCard = ({ stock, onUnsubscribe }) => {
    const classes = useStyles();

    const handleUnsubscribeClick = useCallback(() => {
        onUnsubscribe(stock.key)
    }, [stock, onUnsubscribe]);

    return (
        <Card>
            <CardContent>
                <span role={roles.stockNameText} className={classes.stockTitle}>{stock.key}</span>

                {
                    stock.hasTradeRecorded
                        ? <StockValue value={stock.value} change={stock.change} />
                        : <StockWaiting />
                }

                <div className={classes.buttonContainer}>
                    <Button
                        role={roles.removeFromFeedButton}
                        color="secondary"
                        variant="contained"
                        size="small"
                        onClick={handleUnsubscribeClick}
                    >
                        Unsubscribe
                </Button>
                </div>
            </CardContent>
        </Card>
    )
}

StockCard.propTypes = {
    stock: PropTypes.shape({
        key: PropTypes.string.isRequired,
        hasTradeRecorded: PropTypes.bool.isRequired,
        value: PropTypes.number,
        change: PropTypes.number
    }).isRequired,
    onUnsubscribe: PropTypes.func.isRequired
}

export default memo(StockCard)
