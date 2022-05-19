
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Link,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Alert from '@material-ui/lab/Alert';
import MainLayout from '../components/mainLayout';
import MessageLayout from '../components/messageLayout';
import JectsTable from '../components/jectsTable';
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
  title: {
    paddingBottom: theme.spacing(4),
  },
  wrap: {
    width: theme.spacing(120),
  },
}));

const JectPage = () => {

  const classes = useStyles();

  const [initStartedState, setInitStarted] = useState(false);
  const [jectsReadyState, setJectsReady] = useState(false);
  const [jectsState, setJects] = useState([]);
  const [errorState, setError] = useState(false);


  useEffect(() => {
    if (!initStartedState) {
        setInitStarted(true);
        backend.getUserJectsList().then(resp => {
            setJects(resp);
            setJectsReady(true);
        }, setError);
    }
  }, [initStartedState]);

  if (!jectsReadyState) {
    return <ScreenLocker />;
  }

  if (jectsReadyState && !jectsState.length) {
    return (
      <MessageLayout showHeadLine={true}>
        <Typography variant="h4">
          You have not actual projects.
        </Typography>
        <Box mt={2}>
          <Typography variant="body1">
            You can create new <Link href="/create-ject" variant="body2">project</Link> or find <Link href="/jobs" variant="body2">job</Link>
          </Typography>
        </Box>
      </MessageLayout>
    );
  }


  return (
    <MainLayout>
      <Box className={classes.root}>
        <div className={classes.wrap}>
            <Typography variant="h4" className={classes.title}>
              Projects list
            </Typography>
            { errorState &&
              <Alert
                severity="error"
                className={classes.alert}
              >
                {errorState}
              </Alert>
            }
            <JectsTable
                jectsList={jectsState}
            />
        </div>
      </Box>
    </MainLayout>
  );

};

export default JectPage;
