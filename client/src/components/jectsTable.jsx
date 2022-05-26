import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Card from '@material-ui/core/Card';
import JectsTableRow from './jectsTableRow';

export default function JectsTable({ jectsList }) {
  return (    
    <TableContainer component={Card} square variant="elevation">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {jectsList.map(
            jectData => <JectsTableRow key={jectData.id} ject={jectData} />
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
