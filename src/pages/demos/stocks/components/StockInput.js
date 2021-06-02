import { Button, makeStyles, TextField } from '@material-ui/core'
import React, { memo, useState } from 'react'

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

    return (
        <>
            <form>
                <TextField label="Stock" onChange={(e) => setStockName(e.currentTarget.value)} />
            </form>

            <Button className={classes.btn} variant="contained" color="primary" onClick={() => onStockAdded(stockName)}>Add to feed</Button>
        </>
    )
}

export default memo(StockInput)
