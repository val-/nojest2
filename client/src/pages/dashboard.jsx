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
import ScreenLocker from '../components/screenLocker';
import Alert from '@material-ui/lab/Alert';
import MainLayout from '../components/mainLayout';
import RecentTasksCard from '../components/recentTasksCard';

const useStyles = makeStyles(theme => ({

  card: {
    width: theme.spacing(60),
    margin: theme.spacing(12, 4),
  },

  media: {
    height: 160,
  },

  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },

  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
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

  const [initStartedState, setInitStarted] = useState(false);
  const [tasksReadyState, setTasksReady] = useState(false);
  const [tasksState, setTasks] = useState([]);
  const [errorState, setError] = useState(false);


  useEffect(() => {
    if (!initStartedState) {
        setInitStarted(true);
        backend.getUserTasksList().then(resp => {
            setTasks(resp);
            setTasksReady(true);
        }, setError);
    }
  }, [initStartedState]);

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


  if (!tasksReadyState || !authorizedUserState) {
    return <ScreenLocker />;
  } else {
    return (
      <MainLayout>
        { errorState &&
          <Alert
            severity="error"
            className={classes.alert}
          >
            {errorState}
          </Alert>
        }
        { createJectCard }
        { jectsCard }
        <RecentTasksCard tasks={ tasksState }/>
      </MainLayout>
    );
  }


};

export default DashboardPage;
