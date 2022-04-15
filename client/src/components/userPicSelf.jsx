import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';

export default function UserPic({ userInfo }) {

  if (userInfo.avatar && userInfo.fullName) {
    return (
      <Tooltip title={userInfo.fullName} arrow>
        <Avatar
          src={userInfo.avatar}
        />
      </Tooltip>
    );
  } else if (userInfo.fullName) {
    const firstLetters = userInfo.fullName.split(' ').map(
      word => word[0]
    );
    return (
      <Tooltip title={userInfo.fullName} arrow>
        <Avatar>
          {firstLetters[0] || ''}
          {firstLetters[1] || ''}
        </Avatar>
      </Tooltip>
    );
  } else {
    return (
      <Avatar>
        U
      </Avatar>
    );
  }

}
