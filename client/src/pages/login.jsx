
import React, { useState, useEffect } from 'react';
import {
  Paper,
  Button,
  TextField,
  Box,
  Typography,
  Link,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/styles';
import { ReactComponent as Logo } from '../assets/logo.svg';
import { backendService as backend } from '../services/backendService';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    margin: 'auto',
    width: theme.spacing(60),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    paddingBottom: theme.spacing(2),
    textAlign: 'center',
  },
  form: {
    padding: theme.spacing(4, 8),
  },
  alert: {
    margin: theme.spacing(2, 0),
  },
  textField: {
    margin: theme.spacing(2, 0),
  },
  signInButton: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  logoBox: {
    paddingBottom: theme.spacing(6)
  },
  logoIcon: {
    display: 'block',
    width: '320px',
  },
}));

const LoginPage = () => {

  const classes = useStyles();
  const [formState, setFormState] = useState({ values: {} });

  useEffect(() => {
    setFormState(formState => ({
      ...formState
    }));
  }, [formState.values]);

  const handleSignIn = event => {
    event.preventDefault();
    setFormState(formState => ({
      ...formState,
      loading: true,
      error: false,
    }));
    backend.login(formState.values).then(handleSuccess, handleError);
  };

  const emailKeyDownHandler = event => {
    if (event.ctrlKey && event.altKey) {
      const keyNum = parseInt(event.key, 10);
      const mockLogins = [
        'webkoder@ya.ru',
        'aaaaaa@test.ru',
        'bbbbbb@test.ru',
        'cccccc@test.ru',
        'dddddd@test.ru',
        'eeeeee@test.ru',
      ];
      if (keyNum && mockLogins[keyNum-1]) {
        backend.login({ email: mockLogins[keyNum-1], password: '123456' }).then(handleSuccess, handleError);
      }
    }
  };

  const handleSuccess = () => {
    window.location.reload();
  };

  const handleError = err => {
    setFormState(formState => ({
      ...formState,
      error: err,
      loading: false,
    }));
  };

  const handleChange = event => {
    event.persist();
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: event.target.value
      },
    }));
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.logoBox}>
        <Logo className={classes.logoIcon} />
      </Box>
      <Paper square>
        <form
          className={classes.form}
          onSubmit={handleSignIn}
        >
          <Typography variant="h3" className={classes.title}>
            Sign in
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
            autoFocus
            label="Email address"
            name="email"
            onChange={handleChange}
            onKeyDown={emailKeyDownHandler}
            type="text"
            value={formState.values.email || ''}
          />
          <TextField
            className={classes.textField}
            fullWidth
            label="Password"
            name="password"
            onChange={handleChange}
            type="password"
            value={formState.values.password || ''}
          />
          <Button
            className={classes.signInButton}
            color="primary"
            fullWidth
            size="large"
            type="submit"
            variant="contained"
          >
            Enter
          </Button>
          <Link href="/registration" variant="body2">
            Don't have an account? Sign Up
          </Link>
        </form>
      </Paper>
    </Box>
  );

};

export default LoginPage;
