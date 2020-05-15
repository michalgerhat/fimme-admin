import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
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
            <ContextProvider>
                <ContextConsumer>
                {({loggedIn}) => (
                    <Router>
                        <Switch>
                            <Route exact path="/">
                            {
                                loggedIn ?
                                    <Redirect to="/connections" />
                                :
                                    <Redirect to="/login" />
                            }
                            </Route>
                            <Route exact path="/login">
                                <LoginForm />
                                { loggedIn && <Redirect to="/connections" />}
                            </Route>
                            <Route exact path="/connections">
                                <Header />
                                <ConnectionsList />
                                { !loggedIn && <Redirect to="/login" />}
                            </Route>
                            <Route exact path="/users">
                                <Header />
                                <UsersList />
                                { !loggedIn && <Redirect to="/login" />}
                            </Route>
                        </Switch>
                    </Router>
                )}
                </ContextConsumer>
            </ContextProvider>
        </MuiThemeProvider>
    );
}