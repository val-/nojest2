import React, { useState, useEffect } from 'react';
import {
  Paper,
  Button,
  TextField,
  Box,
  Typography,
  FormControl,
  FormControlLabel,
  Switch,
  InputLabel,
  Select,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Alert from '@material-ui/lab/Alert';
import { useHistory } from 'react-router-dom';
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
    width: theme.spacing(160),
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
  formControlSwitch: {
    width: '47%',
    justifyContent: 'end',
  },

}));

const CreateTaskPage = props => {

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
    history.push(`/version/${resp.versionId}`);
  };

  const handleIsActiveChange = () => {
    // TODO
  };

  return (
    <MainLayout>
      <Box className={classes.root}>
        <Paper square className={classes.paper}>
          <form
            className={classes.form}
            onSubmit={handleSubmit}
          >
            <Typography variant="h4" className={classes.header}>
              Create new project version
            </Typography>
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
              label="New version title"
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
                <InputLabel id="ject-select-label">Project</InputLabel>
                <Select
                  labelId="ject-select-label"
                  id="ject-select"
                  className={classes.select}
                  name="ject"
                  value={formState.values.ject}
                  onChange={handleChange}
                >
                  {/*<MenuItem value={'RU'}>Russian</MenuItem>*/}
                </Select>
              </FormControl>
              <FormControl className={classes.formControlSwitch}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formState.values.isActive}
                      onChange={handleIsActiveChange}
                      name="isActive"
                      color="primary"
                    />
                  }
                  label="Is active version"
                />
              </FormControl>
            </Box>
            <Box className={classes.formRowButtons}>
              <Button
                className={classes.saveButton}
                color="primary"
                size="large"
                type="submit"
                variant="contained"
              >
                Create version
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </MainLayout>
  );

};

export default CreateTaskPage;
