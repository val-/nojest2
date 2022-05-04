
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Link,
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

const OrderPage = props => {

  const classes = useStyles();

  const [initStartedState, setInitStarted] = useState(false);
  const [ordersReadyState, setOrdersReady] = useState(false);
  const [ordersState, setOrders] = useState([]);
  const [errorState, setError] = useState(false);


  useEffect(() => {
    if (!initStartedState) {
        setInitStarted(true);
        backend.getUserOrdersList().then(resp => {
            setOrders(resp);
            setOrdersReady(true);
        }, setError);
    }
  }, [initStartedState]);

  if (!ordersReadyState) {
    return <ScreenLocker />;
  }

  if (ordersReadyState && !ordersState.length) {
    return (
      <MessageLayout showHeadLine={true}>
        <Typography variant="h4">
          You have not actual orders.
        </Typography>
        <Box mt={2}>
          <Typography variant="body1">
            You can create new <Link href="/create-ject" variant="body2">order</Link> or find <Link href="/jobs" variant="body2">job</Link>
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

export default OrderPage;
