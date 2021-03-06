import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import JectPic from './jectPic';
import { useHistory } from 'react-router-dom';

function JectsTableRow({ ject }) {

  const history = useHistory();
  
  const openJect = () => {
    history.push(`/ject/${ject.id}`);
  };

  return (
    <React.Fragment>
      <TableRow hover onClick={openJect}>
        <TableCell>
          <JectPic ject={ject}/>
        </TableCell>
        <TableCell>
          { ject.title }
        </TableCell>
        <TableCell>
          { ject.status }
        </TableCell>
      </TableRow>
    </React.Fragment>
  );

}

export default JectsTableRow;
