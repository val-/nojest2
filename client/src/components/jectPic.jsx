import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  ava_A: { background: 'hsl(360, 100%, 70%)' },
  ava_E: { background: 'hsl(315, 100%, 70%)' },
  ava_H: { background: 'hsl(270, 100%, 70%)' },
  ava_D: { background: 'hsl(225, 100%, 70%)' },
  ava_B: { background: 'hsl(180, 100%, 70%)' },
  ava_C: { background: 'hsl(135, 100%, 70%)' },
  ava_G: { background: 'hsl(90, 100%, 70%)' },
  ava_F: { background: 'hsl(45, 100%, 70%)' },
  ava_J: { background: 'hsl(20, 100%, 70%)' },
}));

export default function JectPic({ ject }) {

  const classes = useStyles();

  if (ject.code) {
      const firstLetters = ject.code.split(' ').map(
        word => word[0]
      );
      return (
        <Tooltip title={''} arrow>
          <Avatar className={classes[`ava_${firstLetters[0]}`]} variant="rounded">
            {firstLetters[0] || ''}
          </Avatar>
        </Tooltip>
      );
    } else {
      return (
        <Tooltip arrow>
          <Avatar>
            ?
          </Avatar>
        </Tooltip>
      );
    }

}
