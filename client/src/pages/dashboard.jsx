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

  const createJectCard = (
    <Card square className={classes.card}>
      <CardActionArea onClick={() => { openPage('create-ject'); }}>
        <CardMedia className={classes.media} title="New project">
          <img src="static/images/clip/order.jpg" alt="New project"/>
        </CardMedia>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            Create new project
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Fill in you project title, description and members.
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary" onClick={() => { openPage('create-ject'); }}>
          New project
        </Button>
      </CardActions>
    </Card>
  );

  const createTaskCard = (
    <Card square className={classes.card}>
      <CardActionArea onClick={() => { openPage('create-task'); }}>
        <CardMedia className={classes.media} title="New task">
          <img src="static/images/clip/work.jpg" alt="New task"/>
        </CardMedia>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            Create new task
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Fill in you task information.
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary" onClick={() => { openPage('create-task'); }}>
          New task
        </Button>
      </CardActions>
    </Card>
  );

  const jectsCard = (
    <Card square className={classes.card}>
      <CardActionArea onClick={() => { openPage('jects'); }}>
        <CardMedia className={classes.media} title="Let`s get working">
          <img src="static/images/clip/work.jpg" alt="Let`s get working"/>
        </CardMedia>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            Actual projects
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            View personal tasks by projects. Direct task team chat.
            <br/>
            We will notify you about task changes.
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary" onClick={() => { openPage('jects'); }}>
          View projects
        </Button>
      </CardActions>
    </Card>
  );

  return (
    <MainLayout>
      { createJectCard }
      { createTaskCard }
      { jectsCard }
    </MainLayout>
  );

};

export default DashboardPage;
