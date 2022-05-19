
import React, { useState, useEffect } from 'react';
import {
  Paper,
  Button,
  TextField,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Alert from '@material-ui/lab/Alert';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { useHistory } from 'react-router-dom';
import ScreenLocker from '../components/screenLocker';
import MainLayout from '../components/mainLayout';
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
  paper: {
    width: theme.spacing(120),
    padding: theme.spacing(8),
  },
  textField: {
    marginBottom: theme.spacing(4),
  },
  header: {
    marginBottom: theme.spacing(2),
  },
  formRowButtons: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  saveButton: {
    marginTop: theme.spacing(4),
  },

  formRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(4),
  },
  formControlSelect: {
    width: '47%',
  },

}));

const CreateTaskPage = () => {

  const classes = useStyles();
  const history = useHistory();
  const mock = {};

  const [formState, setFormState] = useState({ values: mock });

  useEffect(() => {
    setFormState(formState => ({
      ...formState
    }));
  }, [formState.values]);

  const handleChange = event => {
    event.persist();
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: event.target.value,
      },
    }));
  };

  const handleDeadlineChange = newDate => {
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        deadline: newDate,
      },
    }));
  };

  const setErrorState = error => {
    setFormState(formState => ({
      ...formState,
      error,
    }));
  };

  const handleSubmit = event => {
    event.preventDefault();
    setErrorState(false);
    backend.createTask(formState.values).then(
      handleSuccess,
      setErrorState,
    );
  };

  const handleSuccess = resp => {
    history.push(`/task/${resp.taskId}`);
  };

  const [initStartedState, setInitStarted] = useState(false);
  const [jectsReadyState, setJectsReady] = useState(false);
  const [jectsState, setJects] = useState([]);
  const [usersReadyState, setUsersReady] = useState(false);
  const [usersState, setUsers] = useState([]);
  const [errorState, setError] = useState(false);


  useEffect(() => {
    if (!initStartedState) {
        setInitStarted(true);
        backend.getUserJectsList().then(resp => {
            setJects(resp);
            setJectsReady(true);
        }, setError);
        backend.getUsersList().then(resp => {
            setUsers(resp);
            setUsersReady(true);
        }, setError);
    }
  }, [initStartedState]);

  if (!jectsReadyState || !usersReadyState) {
    return <ScreenLocker />;
  }

  if (jectsReadyState && usersReadyState) {
    return (
      <MainLayout>
        <Box className={classes.root}>
          <Paper square className={classes.paper}>
            <form
              className={classes.form}
              onSubmit={handleSubmit}
            >
              <Typography variant="h4" className={classes.header}>
                Create new task
              </Typography>
              { errorState &&
                <Alert
                  severity="error"
                  className={classes.alert}
                >
                  {errorState}
                </Alert>
              }
              { formState.error &&
                <Alert
                  severity="error"
                  className={classes.alert}
                >
                  {formState.error}
                </Alert>
              }
              <TextField
                className={classes.textField}
                fullWidth
                label="New task title"
                name="title"
                type="text"
                value={formState.values.title || ''}
                onChange={handleChange}
              />
              <TextField
                className={classes.textField}
                fullWidth
                label="Description"
                name="description"
                multiline
                type="text"
                value={formState.values.description || ''}
                onChange={handleChange}
              />
              <Box className={classes.formRow}>
                <FormControl className={classes.formControlSelect}>
                  <InputLabel id="ject-select-label">Task project</InputLabel>
                  <Select
                    labelId="ject-select-label"
                    id="ject-select"
                    className={classes.select}
                    name="jectId"
                    value={formState.values.jectId }
                    onChange={handleChange}
                  >
                    {
                      jectsState.map(jectItem => (
                        <MenuItem value={ jectItem.id } key={ jectItem.id }> { jectItem.title } </MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
                <FormControl className={classes.formControlSelect}>
                  <InputLabel id="parent-select-label">Parent task</InputLabel>
                  <Select
                    labelId="parent-select-label"
                    id="parent-select"
                    className={classes.select}
                    name="parentId"
                    value={formState.values.parentId}
                    onChange={handleChange}
                  >
                    {/*<MenuItem value={'ios'}>IOS</MenuItem>*/}
                  </Select>
                </FormControl>
              </Box>
              <Box className={classes.formRow}>
                <FormControl className={classes.formControlSelect}>
                  <InputLabel id="contractor-select-label">Contractor</InputLabel>
                  <Select
                    labelId="contractor-select-label"
                    id="contractor-select"
                    className={classes.select}
                    name="contractorId"
                    value={formState.values.contractorId}
                    onChange={handleChange}
                  >
                    {
                      usersState.map(userItem => (
                        <MenuItem value={ userItem.id } key={ userItem.id }> { userItem.fullName } </MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
                <FormControl className={classes.formControlSelect}>
                  <InputLabel id="version-select-label">Target version</InputLabel>
                  <Select
                    labelId="version-select-label"
                    id="version-select"
                    className={classes.select}
                    name="targetVersionId"
                    value={formState.values.targetVersionId}
                    onChange={handleChange}
                  >
                    {/*<MenuItem value={'ios'}>IOS</MenuItem>*/}
                  </Select>
                </FormControl>
              </Box>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Box className={classes.formRow}>
                  <KeyboardDatePicker
                    className={classes.datePicker}
                    label="Deadline"
                    format="dd.MM.yyyy"
                    value={formState.values.deadline}
                    onChange={handleDeadlineChange}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                </Box>
              </MuiPickersUtilsProvider>
              <Box className={classes.formRowButtons}>
                <Button
                  className={classes.saveButton}
                  color="primary"
                  size="large"
                  type="submit"
                  variant="contained"
                >
                  Create task
                </Button>
              </Box>
            </form>
          </Paper>
        </Box>
      </MainLayout>
    );

  }

};

export default CreateTaskPage;
