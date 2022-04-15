
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Alert from '@material-ui/lab/Alert';
import MainLayout from '../components/mainLayout';
import MessageLayout from '../components/messageLayout';
import OrdersTable from '../components/ordersTable';
import ScreenLocker from '../components/screenLocker';
import { backendService as backend } from '../services/backendService';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrap: {
    width: theme.spacing(120),
  },
}));

const JobsPage = props => {

  const classes = useStyles();

  const [initStartedState, setInitStarted] = useState(false);
  const [ordersReadyState, setOrdersReady] = useState(false);
  const [ordersState, setOrders] = useState([]);
  const [authorizedUserState, setAuthorizedUser] = useState(false);
  const [errorState, setError] = useState(false);


  useEffect(() => {

    if (!authorizedUserState) {
      const { authorizedUser } = backend.getSessionContext();
      setAuthorizedUser(authorizedUser);
    }
    if (!initStartedState) {
        setInitStarted(true);
        backend.getUserJobsList().then(resp => {
            setOrders(resp);
            setOrdersReady(true);
        }, setError);
    }
  }, [authorizedUserState, initStartedState]);

  if (!ordersReadyState) {
    return <ScreenLocker />;
  }

  if (ordersReadyState && !ordersState.length) {
    return (
      <MessageLayout showHeadLine={true}>
        <Typography variant="h4">
          Job for you not found. Sorry.
        </Typography>
        <Box mt={2}>
          <Typography variant="body1">
            But we write email to {authorizedUserState.email} when job will appear.
          </Typography>
        </Box>
      </MessageLayout>
    );
  }

  return (
    <MainLayout>
      <Box className={classes.root}>
        <div className={classes.wrap}>
            { errorState &&
              <Alert
                severity="error"
                className={classes.alert}
              >
                {errorState}
              </Alert>
            }
            <OrdersTable
                ordersList={ordersState}
            />
        </div>
      </Box>
    </MainLayout>
  );

};

export default JobsPage;
