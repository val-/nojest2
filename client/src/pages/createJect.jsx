
import React, { useState, useEffect } from 'react';
import {
  Paper,
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
  formRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(4),
  },
  formRowButtons: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  saveButton: {
    marginTop: theme.spacing(4),
  },
}));

const CreateJectPage = props => {

  const classes = useStyles();
  const history = useHistory();
  const mock = {"title": "Создать прототип сервиса сопровождения UX тестирования","description": "Сущности: language, user, session, message, ject, task, task_history, account, feedback\n\nПользовательский интерфейс: React, Material UI\n\nИмплементация бизнес процессов сущностями реальной БД: PostgreSQL\n\nТранзакции для операций со счетами\n\nОбработка запросов к API: Node, Express\n\nМодели данных в функциональном стиле\n\nОтправка уведомлений по почте\n\nОперативный чат задания\n\nTask status flow\n\nОтзывы и принципы генерации кармы по отзывам\n\nГенерация договоров и отчётов\n\nhttps://github.com/val-/nojest\nhttps://github.com/val-/nojest/blob/main/docs/about-nojest.md\nhttps://github.com/val-/nojest/blob/main/docs/db.md\n","platform": "web","language": "RU","deadline": "2021-12-11T18:00:00.000Z","expectedPrice": "49997"};

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
    backend.createJect(formState.values).then(
      handleSuccess,
      setErrorState,
    );
  };

  const handleSuccess = resp => {
    history.push(`/ject/${resp.jectId}`);
  };

  return (
    <MainLayout>
      <Box className={classes.root}>
        <Paper square className={classes.paper}>
          <form
            className={classes.form}
            onSubmit={handleSubmit}
          >
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
              label="New project title"
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
            <Box className={classes.formRowButtons}>
              <Button
                className={classes.saveButton}
                color="primary"
                size="large"
                type="submit"
                variant="contained"
              >
                Create project
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </MainLayout>
  );

};

export default CreateJectPage;
