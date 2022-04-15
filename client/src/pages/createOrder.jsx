
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
  formCellHalf: {
    width: '47%',
  },
  formControlSelect: {
    width: '47%',
  },
  datePicker: {
    width: '47%',
  },
  saveButton: {
    marginTop: theme.spacing(4),
  },
}));

const CreateOrderPage = props => {

  const classes = useStyles();
  const history = useHistory();
  //const mock = {"title":"Протестировать приложение ежедневник","description":"Пожалуйста, выполните эти действия:\n\n0. Скачайте и установите note.apk на свой телефон\n1. Ведите списки дел и расписание в голосовом электронном ежедневнике\n2. Ставьте в очередь свои планы и следите за их выполнением\n3. Через неделю опишите свои впечатления от программы\n\nВ процессе выполнения размышляйте вслух и проговаривайте все возникающие сложности.","platform":"android","language":"RU","deadline":"2021-01-27T21:00:00.000Z","expectedPrice":"2500"}
  const mock = {"title": "Создать прототип сервиса сопровождения UX тестирования","description": "Сущности: language, user, session, message, order, task, task_history, account, feedback\n\nПользовательский интерфейс: React, Material UI\n\nИмплементация бизнес процессов сущностями реальной БД: PostgreSQL\n\nТранзакции для операций со счетами\n\nОбработка запросов к API: Node, Express\n\nМодели данных в функциональном стиле\n\nОтправка уведомлений по почте\n\nОперативный чат задания\n\nTask status flow\n\nОтзывы и принципы генерации кармы по отзывам\n\nГенерация договоров и отчётов\n\nhttps://github.com/val-/nojest\nhttps://github.com/val-/nojest/blob/main/docs/about-nojest.md\nhttps://github.com/val-/nojest/blob/main/docs/db.md\n","platform": "web","language": "RU","deadline": "2021-12-11T18:00:00.000Z","expectedPrice": "49997"};
  //const mock = {"title":"Забронировать билет на самолёт через сайт websky","description":"Пожалуйста, выполните эти действия:\n\n0. Откройте в браузере https://tst.sirena-travel.ru/websky-test-grt/\n1. Поищите билеты из Москвы в Сочи\n2. Выберите тариф лайт\n3. Перейдите к вводу данных пассажира\n4. Введите данные пассажира и переходите на следующий шаг\n5. Выберите оплату наличными и создайте заказ\n6. Напишите номер заказа\n\nВ процессе выполнения размышляйте вслух и проговаривайте все возникающие сложности.\n","platform":"web","language":"RU","deadline":"2021-12-11T21:00:00.000Z","expectedPrice":"500"};
  const defaultValues = {
    title: '',
    description: '',
    platform: '',
    language: '',
    deadline: null,
  };

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
    backend.createOrder(formState.values).then(
      handleSuccess,
      setErrorState,
    );
  };

  const handleSuccess = resp => {
    history.push(`/order/${resp.orderId}`);
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
              label="New order"
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
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Box className={classes.formRow}>
                <Box className={classes.formCellHalf}>
                  <TextField
                    className={classes.textFieldInRow}
                    fullWidth
                    label="Expected price"
                    name="expectedPrice"
                    type="number"
                    value={formState.values.expectedPrice || ''}
                    onChange={handleChange}
                  />
                </Box>
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
            <Box className={classes.formRow}>
              <FormControl className={classes.formControlSelect}>
                <InputLabel id="language-select-label">Target language</InputLabel>
                <Select
                  labelId="language-select-label"
                  id="language-select"
                  className={classes.select}
                  name="language"
                  value={formState.values.language}
                  onChange={handleChange}
                >
                  <MenuItem value={'RU'}>Russian</MenuItem>
                  <MenuItem value={'EN'}>English</MenuItem>
                </Select>
              </FormControl>
              <FormControl className={classes.formControlSelect}>
                <InputLabel id="platform-select-label">Target platform</InputLabel>
                <Select
                  labelId="platform-select-label"
                  id="platform-select"
                  className={classes.select}
                  name="platform"
                  value={formState.values.platform}
                  onChange={handleChange}
                >
                  <MenuItem value={'ios'}>IOS</MenuItem>
                  <MenuItem value={'android'}>Android</MenuItem>
                  <MenuItem value={'tv'}>TV</MenuItem>
                  <MenuItem value={'mac'}>Mac</MenuItem>
                  <MenuItem value={'pc'}>PC</MenuItem>
                  <MenuItem value={'web'}>Web</MenuItem>
                </Select>
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
                Create order
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </MainLayout>
  );

};

export default CreateOrderPage;
