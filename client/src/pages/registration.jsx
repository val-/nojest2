import React, { useState, useEffect } from 'react';
import {
  Paper,
  Button,
  TextField,
  Box,
  Typography,
  FormControlLabel,
  Switch,
  Link,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/styles';
import MessageLayout from '../components/messageLayout';
import ScreenLocker from '../components/screenLocker';
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
  mainTitle: {
    paddingTop: theme.spacing(7),
    textAlign: 'left',
    height: theme.spacing(20),
    position: 'relative',
    textShadow: '7px 3px 20px rgba(0,0,0,0.8)',
  },
  form: {
    padding: theme.spacing(4, 8),
    position: 'relative',
  },
  bg: {
    position: 'absolute',
    left: 0,
    top: 0,
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
  }
}));

const RegistrationPage = () => {

  const classes = useStyles();

  const [formState, setFormState] = useState({ values: {} });

  useEffect(() => {
    setFormState(formState => ({
      ...formState
    }));
  }, [formState.values]);

  const handleSignUp = event => {
    event.preventDefault();
    setFormState(formState => ({
      ...formState,
      loading: true,
      registrationError: false,
    }));
    backend.registration(formState.values).then(
      handleSuccess,
      handleError,
    );
  };

  const handleSuccess = () => {
    setFormState(formState => ({
      ...formState,
      registrationSuccess: true,
      loading: false,
    }));
  };

  const handleError = err => {
    setFormState(formState => ({
      ...formState,
      registrationError: err,
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

  const handleIsCustomerChange = () => {
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        isCustomer: !formState.values.isCustomer,
      },
    }));
  };

  const handleIsContractorChange = () => {
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        isContractor: !formState.values.isContractor,
      },
    }));
  };

  if (formState.loading) {
    return <ScreenLocker />;
  }

  if (formState.registrationSuccess) {
    return (
      <MessageLayout>
        <Typography variant="h4" className={classes.title}>
          Registration success!
        </Typography>
        <Box mt={2}>
          <Typography variant="body1">
            Please read letter wich we send to {formState.values.email}
          </Typography>
        </Box>
      </MessageLayout>
    );
  }

  return (
    <Box className={classes.root}>
      <Paper square>
        <form
          className={classes.form}
          onSubmit={handleSignUp}
        >
          <img src="static/images/clip/sign-up.jpg" alt="Join our team"  className={classes.bg}/>
          <Typography variant="h3" className={classes.mainTitle}>
            Sign up
          </Typography>
          { formState.registrationError &&
            <Alert
              severity="error"
              className={classes.alert}
            >
              {formState.registrationError}
            </Alert>
          }
          <TextField
            className={classes.textField}
            fullWidth
            label="Full name"
            name="fullName"
            onChange={handleChange}
            type="text"
            value={formState.values.fullName || ''}
          />
          <TextField
            className={classes.textField}
            fullWidth
            label="Email address"
            name="email"
            onChange={handleChange}
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
            disabled={!formState.values.isCustomer && !formState.values.isContractor}
            color="primary"
            fullWidth
            size="large"
            type="submit"
            variant="contained"
          >
            Enter
          </Button>
          <Link href="./" variant="body2">
            Already have an account? Sign in
          </Link>
        </form>
      </Paper>
    </Box>
  );

};

export default RegistrationPage;
