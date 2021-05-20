import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types'
import pageConfig from './page-config';
import { Link } from 'react-router-dom';

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

                <List>
                    {
                        Object.values(pageConfig)
                            .sort((a, b) => a.navOrder - b.navOrder)
                            .map(page => (
                                <ListItem button key={page.url} component={Link} to={page.url}>
                                    <ListItemText primary={page.name} />
                                </ListItem>
                            ))
                    }
                </List>
            </Drawer>
            <main className={classes.content}>
                {children}
            </main>
        </div>
    );
}
