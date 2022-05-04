import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { makeStyles } from '@material-ui/styles';
import Alert from '@material-ui/lab/Alert';
import { useHistory } from 'react-router-dom';
import MainLayout from '../components/mainLayout';
import ScreenLocker from '../components/screenLocker';
import Chat from '../components/chat';
import UserPic from '../components/userPic';
import ConfirmActionPopup from '../components/confirmActionPopup';
import { backendService as backend } from '../services/backendService';
import { utilsService as utils } from '../services/utilsService';
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
}));

const OrderPage = props => {

  const classes = useStyles();
  const history = useHistory();
  let { orderId } = useParams();

  const [initStartedState, setInitStarted] = useState(false);
  const [orderReadyState, setOrderReady] = useState(false);
  const [filedsState, setFields] = useState({});
  const [errorState, setError] = useState(false);
  const [nextStatusDialogState, setNextStatusDialog] = useState(false);

  useEffect(() => {
    if (!initStartedState) {
        setInitStarted(true);
        backend.getOrder(orderId).then(resp => {
            setFields(resp);
            setOrderReady(true);
        }, setError);
    }
  }, [initStartedState, orderId, filedsState]);

  const handleChange = event => {
    event.persist();
  };

  const handleDeadlineChange = newDate => {
  };

  const handleSubmit = event => {
    event.preventDefault();
  };

  const openTask = taskId => {
    history.push(`/task/${taskId}`);
  }

  if (!orderReadyState) {
    return <ScreenLocker />;
  }

  const orderCard = (
    <Card square className={classes.card}>
      <CardHeader
        avatar={
          <UserPic userId={filedsState.authorId}/>
        }
        title={filedsState.title}
        subheader={`order #${filedsState.id}`}
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
    setOrderReady(false);
    backend.changeTaskStatus({
      ...params,
      taskId: filedsState.tasks[0].id,
    }).then(() => {
      backend.getOrder(orderId).then(resp => {
        setFields(resp);
        setOrderReady(true);
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
            variant="contained"
            onClick={() => { setNextStatusDialog('REQUESTED') }}
          >
            Request this job
          </Button>
          <Button
            className={classes.cardActionButton}
            color="primary"
            variant="contained"
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
            variant="contained"
            onClick={() => { openTask(task.id) }}
          >
            Go to task
          </Button>
        </>
      );
    }

  };
  const generateTaskCard = (task, taskIndex) => (
    <Card square className={classes.card} key={taskIndex}>
      <CardHeader
        className={classes.cardHeader}
        avatar={
          <UserPic userId={task.contractorId}/>
        }
        action={
          generateTaskCardActions(task)
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
      { task.status === 'JUST_VIEWED' && !filedsState.own &&
        <Chat task={task}/>
      }
    </Card>
  );

  return (
    <MainLayout>
      <Box className={classes.root}>
        { orderCard }
        { filedsState.tasks && filedsState.tasks.map(generateTaskCard) }
        <ConfirmActionPopup
          nextStatus={nextStatusDialogState}
          handleClose={() => { setNextStatusDialog(false); }}
          handleConfirm={confirmStatusChangeHandler}
        />
      </Box>
    </MainLayout>
  );

};

export default OrderPage;
