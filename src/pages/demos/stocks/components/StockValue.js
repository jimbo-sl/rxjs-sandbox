import { makeStyles } from '@material-ui/core';
import { ArrowDownwardRounded, ArrowUpwardRounded } from '@material-ui/icons';
import { memo, useEffect, useState } from "react"
import roles from '../constants/stocks-element-roles';

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
            <span role={roles.stockValueText} className={classes.stockValue}>{value}</span>
            {
                visible &&
                (
                    change > 0 ? <div role={roles.stockValueIncreased}><ArrowUpwardRounded /></div>
                        : change < 0 ? <div role={roles.stockValueDecreased}><ArrowDownwardRounded /></div>
                            : null
                )
            }
        </div>
    )
}

export default memo(StockValue)
