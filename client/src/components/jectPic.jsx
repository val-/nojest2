import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  ava: { fontWeight: 'bold', color: '#ffffff', textShadow: '1px 1px 2px rgba(0,0,0,0.3), 0 0 1em rgba(0,0,0,0.2)' },
  ava_1: { background: 'hsl(360, 50%, 52%)' },
  ava_4: { background: 'hsl(135, 50%, 52%)' },
  ava_3: { background: 'hsl(270, 50%, 52%)' },
  ava_2: { background: 'hsl(45, 50%, 52%)' },
  ava_A: { background: 'hsl(360, 50%, 52%)' },
  ava_E: { background: 'hsl(315, 50%, 52%)' },
  ava_H: { background: 'hsl(270, 50%, 52%)' },
  ava_D: { background: 'hsl(225, 50%, 52%)' },
  ava_F: { background: 'hsl(180, 50%, 52%)' },
  ava_C: { background: 'hsl(135, 50%, 52%)' },
  ava_G: { background: 'hsl(90, 50%, 52%)' },
  ava_B: { background: 'hsl(45, 50%, 52%)' },
  ava_J: { background: 'hsl(20, 50%, 52%)' },
}));

export default function JectPic({ ject }) {

  const classes = useStyles();

  if (ject.code) {
      const firstLetters = ject.code.split(' ').map(
        word => word[0]
      );
      return (
        <Tooltip title={''} arrow>
          <Avatar className={[ classes.ava, classes[`ava_${firstLetters[0]}`] ]} variant="rounded">
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
