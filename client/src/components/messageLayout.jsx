import React from 'react';
import { Paper, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Headline from './headline';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    margin: 'auto',
    width: theme.spacing(80),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paper: {
    padding: theme.spacing(4, 8),
  },
}));

const MessageLayout = ({ children, showHeadLine = false }) => {

    const classes = useStyles();

    return (
      <Box className={classes.root}>
        { showHeadLine && <Headline /> }
        <Paper square className={classes.paper}>
          {children}
        </Paper>
      </Box>
    );

};

export default MessageLayout;