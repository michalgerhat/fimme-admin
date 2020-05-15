import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Context } from './Context';

const useStyles = makeStyles(theme => ({
    paper: {
        margin: 'auto',
        marginTop: theme.spacing(4),
        minWidth: 480,
        maxWidth: 800
    },
    inner: {
        padding: theme.spacing(2)
    },
    button: {
        height: 56
    }
}));

export default function NewUserForm ()
{
    const classes = useStyles();
    const context = useContext(Context);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleUsername = (event) =>
    {
        setUsername(event.target.value);
    };

    const handlePassword = (event) =>
    {
        setPassword(event.target.value);
    };

    const handleButton = () =>
    {
        if (username !== "" && password !== "")
            context.createUser(username, password);
    }

    return (
        <Paper className={classes.paper}>
            <Grid container>
                <Grid className={classes.inner} container item spacing={2}>
                    <Grid item xs={12}>
                        <Typography>Create a new user</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            fullWidth variant="outlined"
                            id="username"
                            label="Username"
                            defaultValue={username}
                            onChange={handleUsername}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            fullWidth variant="outlined"
                            id="password"
                            label="Password"
                            defaultValue={password}
                            onChange={handlePassword}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <Button 
                            className={classes.button}
                            variant="contained" color="primary"
                            fullWidth size="large"
                            disabled={!context.connected}
                            onClick={handleButton}>
                                Create
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
}