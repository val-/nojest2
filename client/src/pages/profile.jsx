import React, { useState, useEffect } from 'react';
import {
  Paper,
  Button,
  TextField,
  Box,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Typography,
} from '@material-ui/core';
import LanguageIcon from '@material-ui/icons/Language';
import WorkIcon from '@material-ui/icons/Work';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import Rating from '@material-ui/lab/Rating';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/styles';
import MainLayout from '../components/mainLayout';
import ScreenLocker from '../components/screenLocker';
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
    display: 'flex',
    padding: theme.spacing(8),
  },
  cellLeft: {
    paddingRight: theme.spacing(8),
  },
  avatar: {
    width: theme.spacing(20),
    height: theme.spacing(20),
  },
  ratingBox: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  cellRight: {
    flexGrow: 1,
  },
  textField: {
    marginBottom: theme.spacing(4),
  },
  form: {
    paddingTop: theme.spacing(5),
  },
  alert: {
    margin: theme.spacing(2, 0),
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
  formControlSelect: {
    width: '47%',
  },
  datePicker: {
    width: '47%',
  },
  saveButton: {
    marginTop: theme.spacing(4),
  },
  chipsBox: {
    paddingTop: theme.spacing(2),
  },
  avatarFileInput: {
    display: 'none',
  },
}));

const ProfilePage = props => {

  const classes = useStyles();

  const [formState, setFormState] = useState({ initialized: false });

  const MAX_AVA_SIZE = 100000;

  useEffect(() => {
    if (!formState.initialized) {
      const { authorizedUser } = backend.getSessionContext();
      setFormState(() => ({
        initialized: true,
        avatar: authorizedUser.avatar,
        values: {
          fullName: authorizedUser.fullName,
          email: authorizedUser.email,
          phoneNumber: authorizedUser.phoneNumber || '',
        },
      }));
    }
  }, [formState]);

  const handleDelete = () => {};

  const handleUpdateProfile = event => {
    event.preventDefault();
    setFormState(formState => ({
      ...formState,
      initialized: false,
      error: false,
    }));
    backend.updateProfile(formState.values).then(
      handleSuccess,
      handleError,
    );
  };

  const handleSuccess = () => {
    setFormState(formState => ({
      ...formState,
      initialized: true,
    }));
  };

  const handleError = err => {
    setFormState(formState => ({
      ...formState,
      error: err,
      initialized: true,
    }));
  };

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

  const generateAvatar = () => {
    if (formState.avatar) {
      return (
        <Avatar
          className={classes.avatar}
          alt="Avatar"
          src={formState.avatar}
        />
      );
    } else {
      const firstLetters = formState.values.fullName.split(' ').map(
        word => word[0]
      );
      return (
        <Avatar className={classes.avatar}>
          {firstLetters[0] || ''}
          {firstLetters[1] || ''}
        </Avatar>
      );
    }
  };

  const fileInput = React.createRef();

  const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  const handleUploadAvatar = event => {
    event.preventDefault();
    toBase64(fileInput.current.files[0]).then(
      avaBase64 => {
        if (avaBase64.length < MAX_AVA_SIZE) {
          backend.uploadAvatar({
            avaBase64,
            email: formState.values.email,
          });
        } else {
          alert('The file size is too large');
        }
      }
    );
  }

  if (!formState.initialized) {
    return <ScreenLocker />;
  }

  return (
    <MainLayout>
      <Paper square className={classes.paper}>
        <Box className={classes.cellLeft}>
          <form onSubmit={handleUploadAvatar} >
            <label>
              { generateAvatar() }
              <input
                type="file"
                ref={fileInput}
                className={classes.avatarFileInput}
                onChange={handleUploadAvatar}
              />
            </label>
          </form>
        </Box>
        <Box className={classes.cellRight}>
          <Typography variant="h4">
            User profile
          </Typography>
          <form
            className={classes.form}
            onSubmit={handleUpdateProfile}
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
              label="Full name"
              name="fullName"
              type="text"
              onChange={handleChange}
              value={formState.values.fullName || ''}
            />
            <TextField
              className={classes.textField}
              fullWidth
              label="Email address"
              name="email"
              type="text"
              disabled
              value={formState.values.email}
            />
            <TextField
              className={classes.textField}
              fullWidth
              label="Phone number"
              name="phoneNumber"
              type="text"
              onChange={handleChange}
              value={formState.values.phoneNumber}
            />
            <Box className={classes.formRowButtons}>
              <Button
                className={classes.saveButton}
                color="primary"
                size="large"
                type="submit"
                variant="contained"
              >
                Save pfofile
              </Button>
            </Box>
          </form>
        </Box>
      </Paper>
    </MainLayout>
  );

};

export default ProfilePage;
