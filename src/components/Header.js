import React, { useState, useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountIcon from '@material-ui/icons/AccountCircle';
import { Context } from './Context';

const useStyles = makeStyles((theme) => (
{
	root: {
        flexGrow: 1
    },
    title: {
        flexGrow: 1
    },
    tabs: {
        ...theme.mixins.toolbar,
        marginRight: theme.spacing(2)
    }
}));

export default function Header () {
	
    var history = useHistory();
    var location = useLocation();
    const classes = useStyles();
    const context = useContext(Context);
    
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    var tab;
    switch (location.pathname)
    {
        case "/connections":
            tab = 0;
            break;
        
        case "/users":
            tab = 1;
            break;

        default:
            break;
    }

    const handleMenu = (event) => 
    {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () =>
    {
        setAnchorEl(null);
    };

    const handleLogout = () => 
    {
        context.logout();
        history.push("/login");
        setAnchorEl(null);
    };

	const handleConnections = () => {
        history.push("/connections");
	};

	const handleUsers = () => {
        history.push("/users");
    };

	return (
		<AppBar className={classes.root} position="static">
            <Toolbar>
                <Typography variant="h6" className={classes.title}>
                    Fimme Administration Console
                </Typography>
                <Tabs className={classes.tabs} value={tab}>
                    <Tab className={classes.tabs} label="Connections" onClick={handleConnections} />
                    <Tab className={classes.tabs} label="Users" onClick={handleUsers} />
                </Tabs>
                <IconButton color="inherit" onClick={handleMenu}>
                    <AccountIcon />
                </IconButton>
                <Menu
                    keepMounted id="menu-appbar" anchorEl={anchorEl}
                    open={open} onClose={handleCloseMenu}>
                        <MenuItem onClick={handleLogout}>Log out</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
	);
}