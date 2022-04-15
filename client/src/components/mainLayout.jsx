import React from 'react';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import Headline from './headline';

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(14)
  },
  content: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

const MainLayout = ({ children, showHeadLine = true }) => {

    const classes = useStyles();

    return (
      <Box className={classes.root}>
        { showHeadLine && <Headline /> }
        <Box className={classes.content}>
          {children}
        </Box>
      </Box>
    );

};

export default MainLayout;