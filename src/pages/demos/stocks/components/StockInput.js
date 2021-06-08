import { Button, FormLabel, Input, makeStyles, TextField } from '@material-ui/core'
import React, { memo, useCallback, useState } from 'react'
import roles from '../constants/stocks-element-roles';

const useStyles = makeStyles((theme) => ({
    btn: {
        marginRight: theme.spacing(2),
        marginBottom: theme.spacing(2),
        marginTop: theme.spacing(2)
    }
}));

function StockInput({ onStockAdded }) {
    const classes = useStyles();

    const [stockName, setStockName] = useState('');

    const handleSubmit = useCallback(e => {
        e.preventDefault();

        onStockAdded(stockName);
        setStockName('');
    }, [stockName, onStockAdded])

    return (
        <>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Stock"
                    value={stockName}
                    onChange={(e) => setStockName(e.currentTarget.value.toUpperCase())}
                    inputProps={{ role: roles.stockNameInput, style: { textTransform: 'uppercase' } }}
                />
            </form>

            <Button role={roles.addToFeedButton} className={classes.btn} variant="contained" color="primary" onClick={handleSubmit}>Add to feed</Button>
        </>
    )
}

export default memo(StockInput)
