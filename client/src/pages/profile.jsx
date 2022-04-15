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
          dateOfBirth: authorizedUser.dateOfBirth || null,
          gender: authorizedUser.gender || '',
          country: authorizedUser.country || '',
          city: authorizedUser.city || '',
          isCustomer: authorizedUser.isCustomer,
          isContractor: authorizedUser.isContractor,
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

  const handleDateOfBirthChange = newDate => {
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        dateOfBirth: newDate,
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
          <Box className={classes.ratingBox}>
            <Rating
              name="profile-rating"
              value={4.5}
              precision={0.5}
              readOnly
              size="large"
            />
          </Box>
          <Box className={classes.chipsBox}>
            <Chip
              className={classes.chips}
              label="English"
              color="secondary"
              size="small"
              onDelete={handleDelete}
              icon={<LanguageIcon />}
            />
          </Box>
          <Box className={classes.chipsBox}>
            <Chip
              label="Russian"
              color="secondary"
              size="small"
              onDelete={handleDelete}
              icon={<LanguageIcon />}
            />
          </Box>
          <Box className={classes.chipsBox}>
            <Chip
              label="Software engineer"
              color="primary"
              size="small"
              onDelete={handleDelete}
              icon={<WorkIcon />}
            />
          </Box>
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
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Box className={classes.formRow}>
                  <KeyboardDatePicker
                    className={classes.datePicker}
                    label="Date of birth"
                    format="dd.MM.yyyy"
                    value={formState.values.dateOfBirth}
                    onChange={handleDateOfBirthChange}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                  <FormControl className={classes.formControlSelect}>
                    <InputLabel id="gender-select-label">Gender</InputLabel>
                    <Select
                      labelId="gender-select-label"
                      id="gender-select"
                      name="gender"
                      className={classes.select}
                      onChange={handleChange}
                      value={formState.values.gender}
                    >
                      <MenuItem value={'MALE'}>Male</MenuItem>
                      <MenuItem value={'FEMALE'}>Female</MenuItem>
                    </Select>
                  </FormControl>
              </Box>
            </MuiPickersUtilsProvider>
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
            <Box className={classes.formRow}>
              <FormControl className={classes.formControlSelect}>
                <InputLabel id="country-select-label">Country</InputLabel>
                <Select
                  labelId="country-select-label"
                  id="country-select"
                  name="country"
                  className={classes.select}
                  onChange={handleChange}
                  value={formState.values.country}
                >
                  <MenuItem value={'RU'}>Russian Federation</MenuItem>
                  <MenuItem value={'US'}>USA</MenuItem>
                  <MenuItem value={'UK'}>United Kingdom</MenuItem>
                </Select>
              </FormControl>
              <FormControl className={classes.formControlSelect}>
                <InputLabel id="city-select-label">City</InputLabel>
                <Select
                  labelId="city-select-label"
                  id="city-select"
                  name="city"
                  className={classes.select}
                  onChange={handleChange}
                  value={formState.values.city}
                >
                  <MenuItem value={'MOW'}>Moscow</MenuItem>
                  <MenuItem value={'LED'}>Saint Petersburg</MenuItem>
                  <MenuItem value={'AER'}>Sochi</MenuItem>
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
                Save pfofile
              </Button>
              <Button
                className={classes.saveButton}
                color="primary"
                size="large"
                variant="contained"
              >
                Add profession
              </Button>
              <Button
                className={classes.saveButton}
                color="primary"
                size="large"
                variant="contained"
              >
                Add language
              </Button>
            </Box>
          </form>
        </Box>
      </Paper>
    </MainLayout>
  );

};

export default ProfilePage;
