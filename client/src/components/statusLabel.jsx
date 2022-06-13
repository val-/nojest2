import React from 'react';
import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/styles';
import { normalizeUnits } from 'moment';

const useStyles = makeStyles(theme => ({
  status: { fontWeight: 'bold', background: 'none' },
  status_OPENED: { color: theme.palette.info.light },
  status_ASSIGNED: { color: theme.palette.warning.light },
  status_RESOLVED: { color: theme.palette.warning.light },
  status_REOPENED: { color: theme.palette.error.light },
  status_DONE: { color: theme.palette.success.light },
  label: { padding: 0 },
  
}));

export default function StatusLabel({ status, variant }) {

  const classes = useStyles();

  return (
    <Chip
        classes={{
          label: classes.label
        }}
        className={ [classes.status, classes[`status_${status}`], classes[`statusVariant_${variant}`] ] }
        label={status}
      />
  );

}
