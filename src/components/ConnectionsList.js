import React, { useEffect, useContext } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import RefreshIcon from '@material-ui/icons/Refresh';
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
    fab: {
      position: 'absolute',
      bottom: theme.spacing(4),
      right: theme.spacing(4),
    }
}));

export default function ConnectionList ()
{
    const classes = useStyles();
    const context = useContext(Context);

    useEffect(() =>
    {
        if (context.connections.length === 0)
            context.refreshConnections();
    }, [context]);

    return (
        <React.Fragment>
            <Fab
                className={classes.fab} color="primary"
                disabled={!context.connected}
                onClick={context.refreshConnections.bind(this)}>
                    <RefreshIcon />
            </Fab>
            <TableContainer component={Paper} className={classes.root}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Timestamp</StyledTableCell>
                            <StyledTableCell align="right">Client A's coordinates</StyledTableCell>
                            <StyledTableCell align="right">Client B's coordinates</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {context.connections.map((item, index) => (
                        <StyledTableRow key={index}>
                            <StyledTableCell component="th" scope="row">
                                {new Date(item.timestamp * 1000).toLocaleString()}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                lat: {item.a_lat} lon: {item.a_lon} alt: {item.a_alt}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                lat: {item.b_lat} lon: {item.b_lon} alt: {item.b_alt}
                            </StyledTableCell>
                        </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </React.Fragment>
    );
}