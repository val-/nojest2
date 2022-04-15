
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Link,
} from '@material-ui/core';
import { useParams } from 'react-router-dom';
import MessageLayout from '../components/messageLayout';
import ScreenLocker from '../components/screenLocker';
import { backendService as backend } from '../services/backendService';



const ProfileActivationPage = props => {

  let { token } = useParams();
  const [result, setResult] = useState('LOADING');

  useEffect(() => {
    backend.activation(token).then(
      () => {
        setResult(() => 'SUCCESS');
      },
      error => {
        setResult(() => error);
      }
    );
  });

  if (result === 'LOADING') {
    return <ScreenLocker />;
  } else if (result === 'SUCCESS') {
    return (
      <MessageLayout>
        <Typography variant="h4">
          Your email is confirmed!
        </Typography>
        <Box mt={2}>
          <Link href="/login" variant="body1">
            Sign in here
          </Link>
        </Box>
      </MessageLayout>
    );
  } else {
    return (
      <MessageLayout>
        <Typography variant="h4">
          Something went wrong...
        </Typography>
        <Box mt={2}>
          <Typography variant="body1">
            {result}
          </Typography>
        </Box>
      </MessageLayout>
    );
  }

};

export default ProfileActivationPage;
