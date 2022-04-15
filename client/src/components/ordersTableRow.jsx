import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import moment from 'moment';
import { useHistory } from 'react-router-dom';

function OrdersTableRow({ order }) {

  const history = useHistory();
  const deadline = moment(order.deadline).fromNow();

  const openOrder = () => {
    history.push(`/order/${order.id}`);
  };

  return (
    <React.Fragment>
      <TableRow hover onClick={openOrder}>
        <TableCell>
          { order.id }
        </TableCell>
        <TableCell>
          { order.title }
        </TableCell>
        <TableCell>
          { order.expectedPrice }
        </TableCell>
        <TableCell>
          { deadline }
        </TableCell>
      </TableRow>
    </React.Fragment>
  );

}

export default OrdersTableRow;
