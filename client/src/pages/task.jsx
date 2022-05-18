
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import {
  CardHeader,
  Button,
  Box,
  Card,
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
}));

const TaskPage = () => {

  const classes = useStyles();
  const history = useHistory();
  let { taskId } = useParams();

  const [initStartedState, setInitStarted] = useState(false);
  const [taskState, setTask] = useState({});
  const [nextStatusDialogState, setNextStatusDialog] = useState(false);
  const [errorState, setError] = useState(false);


  const actionButtonsByNextStatus = {
    REQUESTED: 'Request this job',
    REJECTED_BY_CONTRACTOR: 'Reject',
    REJECTED_BY_CUSTOMER: 'Reject',
    ASSIGNED: 'Assign',
    RESOLVED: 'Resolve',
    DISPUTE: 'Dispute',
    CANCELLED: 'Cancel',
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

  const openJect = jectId => {
    history.push(`/ject/${jectId}`);
  };

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

  const generateJectCard = ject => (
    !ject ? '':
    <Card square className={classes.card}>
      <CardHeader
        className={classes.cardHeader}
        action={
          <Button
            className={classes.cardActionButton}
            color="primary"
            variant="contained"
            onClick={() => { openJect(ject.id) }}
          >
            Go to project
          </Button>
        }
        title={ject.title}
        subheader={`# ${ject.code}`}
      >
      </CardHeader>
    </Card>
  );

  const generateTaskCard = task => (
    task.id === undefined ? '':
    <Card square className={classes.card}>
      <CardHeader
        className={classes.cardHeader}
        avatar={
          <UserPic userId={task.contractorId}/>
        }
        action={
          generateTaskCardActions(task.nextStatusVariants)
        }
        title={
          <>
            { task.status }
            { 
              task.status === 'REQUESTED' &&
              <span> { utils.formatPrice(task.contractorPrice) }</span>
            }
          </>
        }
        subheader={`task #${task.id}`}
      >
      </CardHeader>
    </Card>
  );

  return (
    <MainLayout>
      <Box className={classes.root}>
        { generateJectCard(taskState.ject) }
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
