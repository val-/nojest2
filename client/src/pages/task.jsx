
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import {
  CardHeader,
  Button,
  Box,
  Card,
  CardMedia,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import MainLayout from '../components/mainLayout';
import Chat from '../components/chat';
import UserPic from '../components/userPic';
import ConfirmActionPopup from '../components/confirmActionPopup';
import { backendService as backend } from '../services/backendService';
import { utilsService as utils } from '../services/utilsService';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: theme.spacing(120),
    marginBottom: theme.spacing(2),
  },
  cardActionButton: {
    marginLeft: theme.spacing(2),
  },
  media: {
    whiteSpace: 'pre',
    padding: theme.spacing(2, 9),
    background: 'rgba(0,0,0,0.17)',
    borderTop: 'rgba(0,0,0,0.3) 1px solid',
    borderBottom: 'rgba(0,0,0,0.3) 1px solid',
  },
}));

const TaskPage = () => {

  const classes = useStyles();
  let { taskId } = useParams();

  const [initStartedState, setInitStarted] = useState(false);
  const [taskState, setTask] = useState({});
  const [nextStatusDialogState, setNextStatusDialog] = useState(false);
  const [errorState, setError] = useState(false);


  const actionButtonsByNextStatus = {
    OPENED: 'Open',
    ASSIGNED: 'Assign',
    RESOLVED: 'Resolve',
    REOPENED: 'Reopen',
    DONE: 'Done',
  };

  useEffect(() => {
    if (!initStartedState) {
        setInitStarted(true);
        updateTask();
    }
  }, [initStartedState, taskId, taskState]);

  const updateTask = () => {
    setTask({});
    backend.getTask(taskId).then(resp => {
      setTask(resp);
      backend.waitStatusChangeByTask(taskId).then(updateTask);
    }, setError);
  }

  const confirmStatusChangeHandler = params => {
    setNextStatusDialog(false);
    backend.changeTaskStatus({
      ...params,
      taskId,
    }).then(() => {
      backend.getTask(taskId).then(setTask, setError);
    }, setError);
  };

  const generateTaskCardActions = nextStatusVariants => (
    <>
      {
        nextStatusVariants.map(
          nextStatus => (
            <Button
            className={classes.cardActionButton}
            color="primary"
            variant="contained"
            key={nextStatus}
            onClick={() => { setNextStatusDialog(nextStatus) }}
          >
            { actionButtonsByNextStatus[nextStatus] }
          </Button>
          )
        )
      }
    </>
  );

  const generateTaskCard = task => (
    task.id === undefined ? '':
    <Card square className={classes.card}>
      <CardHeader
        className={classes.cardHeader}
        action={
          generateTaskCardActions(task.nextStatusVariants)
        }
        title={ task.title }
        subheader={ task.status }
      >
      </CardHeader>
      <CardMedia className={classes.media}>
        { task.description }
      </CardMedia>
    </Card>
  );

  return (
    <MainLayout>
      <Box className={classes.root}>
        { generateTaskCard(taskState) }
        { taskState.id === undefined ? '':
          <Card square className={classes.card}>
            <Chat
              task={taskState}
            />
          </Card>
        }
        <ConfirmActionPopup
          nextStatus={nextStatusDialogState}
          handleClose={() => { setNextStatusDialog(false); }}
          handleConfirm={confirmStatusChangeHandler}
        />
      </Box>
    </MainLayout>
  );

};

export default TaskPage;
