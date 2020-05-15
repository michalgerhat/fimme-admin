import React, { useState, useContext } from 'react';
import IconButton from '@material-ui/core/IconButton';
import KeyIcon from '@material-ui/icons/VpnKey';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import { Context } from './Context';

export default function IconButtonWithDialog ({username})
{
    const context = useContext(Context);
    const [open, setOpen] = useState(false);
    const [password, setPassword] = useState("");

    const handleClickOpen = () => 
    {
        setOpen(true);
    };

    const handleClose = () => 
    {
        setOpen(false);
    };

    const handlePassword = (event) =>
    {
        setPassword(event.target.value);
    }

    const changePassword = () =>
    {
        context.changePassword(username, password);
        setOpen(false);
    };

    return (
        <React.Fragment>
            <IconButton onClick={handleClickOpen}>
                <KeyIcon />
            </IconButton>
            <Dialog open={open} onClose={handleClose}>
                <DialogContent>
                    <TextField
                        fullWidth autoFocus
                        id="password" label="New password"
                        defaultValue={password} onChange={handlePassword}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={changePassword} color="primary">
                        Change
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}