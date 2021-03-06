import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  CardMedia,
  Button,
  Box,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Alert from '@material-ui/lab/Alert';
import { useHistory } from 'react-router-dom';
import MainLayout from '../components/mainLayout';
import ScreenLocker from '../components/screenLocker';
import ConfirmActionPopup from '../components/confirmActionPopup';
import GanttChart from '../components/ganttChart';
import JectPic from '../components/jectPic';
import StatusLabel from '../components/statusLabel';
import { backendService as backend } from '../services/backendService';
import { useParams } from 'react-router-dom';

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
    width: theme.spacing(160),
    marginBottom: theme.spacing(2),
  },
  cardActionButton: {
    marginRight: theme.spacing(2),
  },
  media: {
    whiteSpace: 'pre',
    padding: theme.spacing(2, 9),
    background: 'rgba(0,0,0,0.17)',
    borderTop: 'rgba(0,0,0,0.3) 1px solid',
    borderBottom: 'rgba(0,0,0,0.3) 1px solid',
  },
  content: {
    padding: theme.spacing(2, 9),
  },
  textField: {
    marginBottom: theme.spacing(4),
  },
  formRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(4),
  },
  formRowButtons: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  formCellHalf: {
    width: '47%',
  },
  formControlSelect: {
    width: '47%',
  },
  datePicker: {
    width: '47%',
  },
  tasks: {
    display: 'flex',
    flexWrap: 'wrap',
    width: theme.spacing(180),
    justifyContent: 'center'
  },
  taskCard: {
    width: theme.spacing(37),
    margin: theme.spacing(2),
    //
  },
  cardHeaderTitle: {
    minHeight: theme.spacing(12),
  },
  cardHeader: {
    
  },
}));

const JectPage = () => {

  const classes = useStyles();
  const history = useHistory();
  let { jectId } = useParams();

  const [initStartedState, setInitStarted] = useState(false);
  const [jectReadyState, setJectReady] = useState(false);
  const [filedsState, setFields] = useState({});
  const [errorState, setError] = useState(false);
  const [nextStatusDialogState, setNextStatusDialog] = useState(false);

  useEffect(() => {
    if (!initStartedState) {
        setInitStarted(true);
        backend.getJect(jectId).then(resp => {
            setFields(resp);
            setJectReady(true);
        }, setError);
    }
  }, [initStartedState, jectId, filedsState]);

  const handleSubmit = event => {
    event.preventDefault();
  };

  const openTask = taskId => {
    history.push(`/task/${taskId}`);
  }

  const openPage = code => {
    history.push(`/${code}`);
  }

  if (!jectReadyState) {
    return <ScreenLocker />;
  }

  const jectCard = (
    <Card square className={classes.card}>
      <CardHeader
        avatar={
          <JectPic ject={filedsState}/>
        }
        title={filedsState.title}
      />
      <CardMedia className={classes.media}>
        {filedsState.description}
      </CardMedia>
      <CardContent className={classes.content}>
        <form
          className={classes.form}
          onSubmit={handleSubmit}
        >
          { errorState &&
            <Alert
              severity="error"
              className={classes.alert}
            >
              {errorState}
            </Alert>
          }
        </form>
      </CardContent>
    </Card>
  );

  const confirmStatusChangeHandler = params => {
    setNextStatusDialog(false);
    setJectReady(false);
    backend.changeTaskStatus({
      ...params,
      taskId: filedsState.tasks[0].id,
    }).then(() => {
      backend.getJect(jectId).then(resp => {
        console.log('resp: ', resp);
        setFields(resp);
        setJectReady(true);
      }, setError);
    }, setError);
  };

  const generateTaskCardActions = task => {
    if (task.status === 'JUST_VIEWED' && !filedsState.own) {
      return (
        <>
          <Button
            className={classes.cardActionButton}
            color="primary"
            onClick={() => { setNextStatusDialog('REQUESTED') }}
          >
            Request this job
          </Button>
          <Button
            className={classes.cardActionButton}
            color="primary"
            onClick={() => { openTask(task.id) }}
          >
            Go to task
          </Button>
        </>
      );
    } else {
      return (
        <>
          <Button
            className={classes.cardActionButton}
            color="primary"
            onClick={() => { openTask(task.id) }}
          >
            Go to task {`#${filedsState.code}-${task.id}`}
          </Button>
        </>
      );
    }

  };
  const generateTaskCard = (task, taskIndex) => (
    <Card square className={classes.taskCard} key={taskIndex}>
      <CardHeader
        className={classes.cardHeader}
        subheader={
          <div className={classes.cardHeaderTitle}>
            {task.title}
          </div>
        }
        title={(
          <StatusLabel status={task.status}/>
        )}
      >
      </CardHeader>
      <CardActions disableSpacing={true}>
        { generateTaskCardActions(task) }
      </CardActions>
    </Card>
  );

  return (
    <MainLayout>
      <Box className={classes.root}>
        { jectCard }


        <Box className={classes.tasks}>
          { filedsState.tasks && filedsState.tasks.map(generateTaskCard) }
        </Box>


        <GanttChart tasks={filedsState.tasks} />

        {/* <KanbanChart tasks={filedsState.tasks} /> */}

        <div className={classes.footer}>
          <Button size="small" color="primary" onClick={() => { openPage(`create-task/${filedsState.id}`); }}>
            New task
          </Button>
        </div>

        <ConfirmActionPopup
          nextStatus={nextStatusDialogState}
          handleClose={() => { setNextStatusDialog(false); }}
          handleConfirm={confirmStatusChangeHandler}
        />
      </Box>
    </MainLayout>
  );

};

export default JectPage;
