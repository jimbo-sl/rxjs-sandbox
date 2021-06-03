import { makeStyles } from '@material-ui/core';
import { ArrowDownwardRounded, ArrowUpwardRounded } from '@material-ui/icons';
import { memo, useEffect, useState } from "react"

const useStyles = makeStyles((theme) => ({
    stockValue: {
        display: 'inline-block',
        fontWeight: 500,
        marginRight: theme.spacing(2)
    },
    stockValueContainer: {
        display: 'inline-flex',
        verticalAlign: 'middle'
    }
}));

function StockValue({ value, change }) {
    const classes = useStyles();

    const [visible, setVisible] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setVisible(false)
        }, 1000);
    }, [])

    return (
        <div className={classes.stockValueContainer}>
            <span className={classes.stockValue}>{value}</span>
            {
                visible &&
                (
                    change > 0 ? <ArrowUpwardRounded />
                        : change < 0 ? <ArrowDownwardRounded />
                            : null
                )
            }
        </div>
    )
}

export default memo(StockValue)
