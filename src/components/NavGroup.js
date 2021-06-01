import { List, ListSubheader } from '@material-ui/core'
import React, { memo } from 'react'
import NavItem from './NavItem';

const NavGroup = ({ group }) => (
    <List subheader={
        <ListSubheader component="div">
            {group.name}
        </ListSubheader>
    }>
        {
            group.options.map(route => (
                <NavItem nested key={route.url} route={route} />
            ))
        }
    </List>
)

export default memo(NavGroup)
