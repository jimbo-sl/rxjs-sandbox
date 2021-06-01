import { ListItem, ListItemText, makeStyles } from '@material-ui/core'
import React, { memo } from 'react'
import { Link } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
    thing: {
        marginLeft: theme.spacing(2)
    }
}));

function NavItem({ route, nested = false }) {
    const classes = useStyles();

    return (
        <ListItem button component={Link} to={route.url}>
            <ListItemText className={nested ? classes.thing : ''} primary={route.name} />
        </ListItem>
    )
}

export default memo(NavItem)
