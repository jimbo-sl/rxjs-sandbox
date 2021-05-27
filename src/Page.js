import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import PropTypes from 'prop-types'
import routes from './routes';
import NavGroup from './components/NavGroup';
import NavItem from './components/NavItem';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        height: '100%'
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(3)
    }
}));

Page.propTypes = {
    children: PropTypes.element.isRequired
}

const groups = routes.reduce((groups, route) => {
    if (route.category == null) {
        groups[route.name] = {
            ...route,
            isGroup: false
        };
    }
    else {
        const group = (groups[route.category] || { options: [] });
        group.name = route.category;
        group.isGroup = true;
        group.options.push(route);
        groups[route.category] = group;
    }

    return groups;
}, {});

export default function Page({ children }) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
                anchor="left"
            >
                {
                    Object.values(groups)
                        .sort((a, b) => a.isGroup - b.isGroup)
                        .map((item) =>
                            item.isGroup
                                ? <NavGroup key={item.name} group={item} />
                                : <NavItem key={item.url} route={item} />
                        )
                }
            </Drawer>
            <main className={classes.content}>
                {children}
            </main>
        </div>
    );
}
