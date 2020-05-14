import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { ContextConsumer } from './Context';

const useStyles = makeStyles(theme => ({
    paper: {
        margin: 'auto',
        marginTop: theme.spacing(4),
        padding: theme.spacing(2),
        maxWidth: '480px'
    },
    button: {
        height: '56px'
    }
}));

export default function LoginForm ()
{
    const classes = useStyles();

    const [server, setServer] = useState("ws://localhost:8080");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleServer = (event) =>
    {
        setServer(event.target.value);
    }

    const handleUsername = (event) =>
    {
        setUsername(event.target.value);
    }

    const handlePassword = (event) =>
    {
        setPassword(event.target.value);
    }

    return (
        <ContextConsumer>
        {({connected, connect, login}) => (
            <Paper className={classes.paper}>
                <Grid container spacing={2} direction="column">
                    <Grid item>
                        <Grid container spacing={2}>
                            <Grid item xs={9}>
                                <TextField
                                    fullWidth variant="outlined"
                                    id="server"
                                    label="Server URL"
                                    defaultValue={server}
                                    onChange={handleServer}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <Button
                                    className={classes.button}
                                    variant="contained" color="primary"
                                    fullWidth size="large"
                                    disabled={connected}
                                    onClick={connect.bind(this, server)}>
                                        { connected ? "Connected" : "Connect" }
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <TextField
                            fullWidth variant="outlined"
                            id="username"
                            label="Username"
                            defaultValue={username}
                            onChange={handleUsername}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            fullWidth variant="outlined"
                            id="password"
                            type="password"
                            label="Password"
                            defaultValue={password}
                            onChange={handlePassword}
                        />
                    </Grid>
                    <Grid item>
                        <Button 
                            className={classes.button}
                            variant="contained" color="primary"
                            fullWidth size="large"
                            disabled={!connected}
                            onClick={login.bind(this, username, password)}>
                                Log in
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        )}
        </ContextConsumer>
    );
}