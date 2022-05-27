import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import Card from '@material-ui/core/Card';
import JectsTableRow from './jectsTableRow';
import { makeStyles } from '@material-ui/styles';


const useStyles = makeStyles(theme => ({

  root: {
    width: theme.spacing(60),
    margin: theme.spacing(0, 4),
  },

  heading: {

  },


}));

export default function JectsTableSmall({ jectsList }) {

  const classes = useStyles();

  return (    
    <TableContainer component={Card} square variant="elevation" className={classes.root}>
      <Table>
        <TableBody>
          {jectsList.filter((p, n) => n < 5).map(
            jectData => <JectsTableRow key={jectData.id} ject={jectData} />
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

}
