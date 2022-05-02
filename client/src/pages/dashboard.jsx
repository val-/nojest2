import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from '@material-ui/core';

import { makeStyles } from '@material-ui/styles';
import { useHistory } from 'react-router-dom';
import { backendService as backend } from '../services/backendService';
import MainLayout from '../components/mainLayout';

const useStyles = makeStyles(theme => ({

  card: {
    width: theme.spacing(60),
    margin: theme.spacing(12, 4),
  },

  media: {
    height: 160,
  },

}));

const DashboardPage = props => {

  const classes = useStyles();
  const history = useHistory();

  const [authorizedUserState, setAuthorizedUser] = useState(false);

  useEffect(() => {
    if (!authorizedUserState) {
      const { authorizedUser } = backend.getSessionContext();
      setAuthorizedUser(authorizedUser);
    }
  }, [authorizedUserState]);

  const openPage = code => {
    history.push(`/${code}`);
  }

  const createOrderCard = (
    <Card square className={classes.card}>
      <CardActionArea onClick={() => { openPage('create-order'); }}>
        <CardMedia className={classes.media} title="New order">
          <img src="static/images/clip/order.jpg" alt="New order"/>
        </CardMedia>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            Create new order
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Fill in you project description and respondents conditions.
            <br/>
            We will notify you about the requests for the order.
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary" onClick={() => { openPage('create-order'); }}>
          New order
        </Button>
      </CardActions>
    </Card>
  );

  const ordersCard = (
    <Card square className={classes.card}>
      <CardActionArea onClick={() => { openPage('orders'); }}>
        <CardMedia className={classes.media} title="Let`s get working">
          <img src="static/images/clip/work.jpg" alt="Let`s get working"/>
        </CardMedia>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            Actual orders
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            View personal tasks by orders. Direct task team chat.
            <br/>
            We will notify you about task changes.
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary" onClick={() => { openPage('orders'); }}>
          View orders
        </Button>
      </CardActions>
    </Card>
  );

  const jobsCard = (
    <Card square className={classes.card}>
      <CardActionArea onClick={() => { openPage('jobs'); }}>
        <CardMedia className={classes.media} title="New order">
          <img src="static/images/clip/create.jpg" alt="New order"/>
        </CardMedia>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            Get a job
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            View actual available tasks.
            <br/>
            We will notify you about new orders.
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary" onClick={() => { openPage('jobs'); }}>
          View tasks
        </Button>
      </CardActions>
    </Card>
  );

  return (
    <MainLayout>
      { ordersCard }
    </MainLayout>
  );

};

export default DashboardPage;
