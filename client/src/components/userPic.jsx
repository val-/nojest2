import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';

import { backendService as backend } from '../services/backendService';

export default function UserPic({ userId }) {

  const [initStartedState, setInitStarted] = useState(false);
  const [filedsState, setFields] = useState({});
  const [errorState, setError] = useState(false);


  useEffect(() => {
    if (!initStartedState) {
        setInitStarted(true);
        backend.getUserInfo(userId).then(resp => {
            setFields(resp);
        }, resp => {
          setError(resp.error);
        });
    }
  }, [initStartedState, userId]);

  if (errorState) {

    return (
      <Tooltip title={errorState} arrow>
        <Avatar>
          E
        </Avatar>
      </Tooltip>
    );

  } else {

    if (filedsState.avatar && filedsState.fullName) {
      return (
        <Tooltip title={filedsState.fullName} arrow>
          <Avatar
            src={filedsState.avatar}
          />
        </Tooltip>
      );
    } else if (filedsState.fullName) {
      const firstLetters = filedsState.fullName.split(' ').map(
        word => word[0]
      );
      return (
        <Tooltip title={filedsState.fullName} arrow>
          <Avatar>
            {firstLetters[0] || ''}
            {firstLetters[1] || ''}
          </Avatar>
        </Tooltip>
      );
    } else {
      return (
        <Tooltip title={userId} arrow>
          <Avatar>
            U
          </Avatar>
        </Tooltip>
      );
    }

  }
}
