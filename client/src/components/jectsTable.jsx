import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import Card from '@material-ui/core/Card';
import JectsTableRow from './jectsTableRow';

export default function JectsTable({ jectsList }) {
  return (    
    <TableContainer component={Card} square variant="elevation">
      <Table>
        <TableBody>
          {jectsList.map(
            jectData => <JectsTableRow key={jectData.id} ject={jectData} />
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
