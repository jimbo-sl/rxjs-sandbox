import { Button, Card, CardContent, makeStyles } from '@material-ui/core'
import { ArrowDownwardRounded, ArrowUpwardRounded } from '@material-ui/icons'
import React from 'react'

const useStyles = makeStyles((theme) => ({
    stockTitle: {
        display: 'block',
        fontWeight: 700,
        marginBottom: theme.spacing(2)
    },
    stockValue: {
        display: 'inline-block',
        fontWeight: 500,
        marginRight: theme.spacing(2)
    },
    stockValueContainer: {
        display: 'inline-flex',
        verticalAlign: 'middle'
    },
    buttonContainer: {
        display: 'block',
        marginTop: theme.spacing(2)
    }
}));

const StockCard = ({ stock, onUnsubscribe }) => {
    const classes = useStyles();

    return (
        <Card>
            <CardContent>
                <span className={classes.stockTitle}>{stock.key}</span>
                <div className={classes.stockValueContainer}>
                    <span className={classes.stockValue}>{stock.value}</span>
                    {
                        stock.change > 0 ? <ArrowUpwardRounded />
                            : stock.change < 0 ? <ArrowDownwardRounded />
                                : null
                    }
                </div>
                <div className={classes.buttonContainer}>
                    <Button
                        color="secondary"
                        variant="contained"
                        size="small"
                        onClick={() => onUnsubscribe(stock.key)}
                    >
                        Unsubscribe
                </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default StockCard
