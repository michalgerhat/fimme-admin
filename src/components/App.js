import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';
import Header from './Header';
import LoginForm from './LoginForm';
import ConnectionsList from './ConnectionsList';
import UsersList from './UsersList';
import { ContextProvider, ContextConsumer } from './Context';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#6200EE'
        },
        secondary: {
            main: '#FFFFFF'
        }
    }
});

export default function App () 
{
    return (
        <MuiThemeProvider theme={theme}>
            <SnackbarProvider>
                <ContextProvider>
                    <ContextConsumer>
                    {({loggedIn}) => (
                        <Router>
                            <Switch>
                                <Route exact path="/fimme-admin">
                                {
                                    loggedIn ?
                                        <Redirect to="/fimme-admin/connections" />
                                    :
                                        <Redirect to="/fimme-admin/login" />
                                }
                                </Route>
                                <Route exact path="/fimme-admin/login">
                                    <LoginForm />
                                    { loggedIn && <Redirect to="/fimme-admin/connections" /> }
                                </Route>
                                <Route exact path="/fimme-admin/connections">
                                    <Header />
                                    <ConnectionsList />
                                    { !loggedIn && <Redirect to="/fimme-admin/login" /> } 
                                </Route>
                                <Route exact path="/fimme-admin/users">
                                    <Header />
                                    <UsersList />
                                    { !loggedIn && <Redirect to="/fimme-admin/login" /> }
                                </Route>
                            </Switch>
                        </Router>
                    )}
                    </ContextConsumer>
                </ContextProvider>
            </SnackbarProvider>
        </MuiThemeProvider>
    );
}