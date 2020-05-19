import React, { useContext } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import RemoveIcon from '@material-ui/icons/Clear';
import Fab from '@material-ui/core/Fab';
import RefreshIcon from '@material-ui/icons/Refresh';
import NewUserForm from './NewUserForm';
import IconButtonWithDialog from './IconButtonWithDialog';
import { Context } from './Context';

const StyledTableCell = withStyles((theme) => (
{
    head: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white
    },
    body: {
        fontSize: 14
    }
}))(TableCell);

const StyledTableRow = withStyles((theme) => (
{
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

const useStyles = makeStyles((theme) => (
{
    root: {
        margin: 'auto',
        marginTop: theme.spacing(4),
        minWidth: 480,
        maxWidth: 800
    },
    rightCell: {
        width: 48,
        padding: 0
    },
    fab: {
      position: 'absolute',
      bottom: theme.spacing(4),
      right: theme.spacing(4),
    }
}));

export default function UsersList ()
{
    const classes = useStyles();
    const context = useContext(Context);

    const handleRemove = (username) => 
    {
        context.removeUser(username);
    };

    return (
        <React.Fragment>
            <Fab
                className={classes.fab} color="primary"
                disabled={!context.connected}
                onClick={context.refreshUsers}>
                    <RefreshIcon />
            </Fab>
            <NewUserForm />
            <TableContainer component={Paper} className={classes.root}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Username</StyledTableCell>
                            <StyledTableCell />
                            <StyledTableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {context.users.map((item, index) => (
                        <StyledTableRow key={index}>
                            <StyledTableCell component="th" scope="row">
                                {item.username}
                            </StyledTableCell>
                            <StyledTableCell className={classes.rightCell} align="right">
                                <IconButtonWithDialog username={item.username} />
                            </StyledTableCell>
                            <StyledTableCell className={classes.rightCell} align="right">
                                <IconButton
                                    disabled={!context.connected}
                                    onClick={handleRemove.bind(this, item.username)}>
                                    <RemoveIcon />
                                </IconButton>
                            </StyledTableCell>
                        </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </React.Fragment>
    );
}