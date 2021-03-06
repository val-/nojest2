import React from 'react';
import {
  Typography,
  Box,
} from '@material-ui/core';

import moment from 'moment';
//import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';

import StatusLabel from './statusLabel';

const useStyles = makeStyles(theme => ({

  root: {
    width: theme.spacing(160),
    margin: theme.spacing(12, 4),
  },

  line: {
    padding: theme.spacing(2, 0),
    position: 'relative',
  },

  lineProgress: {
    position: 'absolute',
    left: 0,
    width: theme.spacing(160),
    background: theme.palette.background.paper,
  },

  lineProgressTime: {
    height: theme.spacing(1),
    background: theme.palette.primary.light,
  },

  lineProgressWork: {
    position: 'absolute',
    left: 0,
    width: theme.spacing(160),
  },

  lineProgressWorkTime: {
    height: theme.spacing(1),
    background: theme.palette.warning.light,
  },


}));

export default function GanttChart({ tasks }) {

  const classes = useStyles();
/*
  const history = useHistory();

  const openPage = code => {
    history.push(`/${code}`);
  }
*/
  const LineProgress = ({ from, to }) => {
    const w = Math.round(to - from);
    return (
      <Box className={classes.lineProgress}>
        <Box className={classes.lineProgressTime} style={ { width: w + '%', marginLeft: from + '%' } }>
          {/* <Tooltip title={userInfo.fullName} arrow>
            <Box className={classes.lineDot}>123</Box>
          </Tooltip> */}
        </Box>
      </Box>
    );
  };

  const LineProgressWork = ({ from, to }) => {
    const w = Math.round(to - from);
    return (
      <Box className={classes.lineProgressWork}>
        <Box className={classes.lineProgressWorkTime} style={ { width: w + '%', marginLeft: from + '%' } }>
          {/* <Tooltip title={userInfo.fullName} arrow>
            <Box className={classes.lineDot}>123</Box>
          </Tooltip> */}
        </Box>
      </Box>
    );
  };


  const generateLine = (task, deltaTime, minTime) => {

    const fromTime = (new Date(task.histIndex.OPENED)).getTime();
    const fromWorkTime = (new Date(task.histIndex.ASSIGNED)).getTime();
    const toTime = (new Date(task.histIndex.DEADLINE)).getTime();
    const toWorkTime = (new Date(task.histIndex.RESOLVED)).getTime();

    const from = Math.round((fromTime - minTime)*100/deltaTime);
    const fromWork = Math.round((fromWorkTime - minTime)*100/deltaTime);
    const to = Math.round((toTime - minTime)*100/(deltaTime));
    const toWork = Math.round((toWorkTime - minTime)*100/(deltaTime));


    return (
      <Box key={task.id} className={classes.line}>
          <Typography className={classes.heading}>
            { task.title } 
          </Typography>
          <Typography className={classes.secondaryHeading}>
            <StatusLabel status={task.status}/> &nbsp;
            { moment(task.histIndex.OPENED).format("DD.MM.YYYY") } &nbsp; - &nbsp;
            { moment(task.histIndex.DEADLINE).format("DD.MM.YYYY") }
          </Typography>
          <LineProgress from={from} to={to} />
          <LineProgressWork from={fromWork} to={toWork} />
      </Box>
    );
  };

  let minTime = 9653555719765;
  let maxTime = -1;

  tasks.forEach(
    task => {
      task.histIndex = {};
      task.history.push({
        dateTime: task.deadline,
        status: "DEADLINE",
      });
      task.history.forEach(
        histRec => {
          
          const histRecTime = (new Date(histRec.dateTime)).getTime();
          task.histIndex[histRec.status] = histRec.dateTime;
          if (histRecTime > maxTime) {
            maxTime = histRecTime;
          }
          if (histRecTime < minTime) {
            minTime = histRecTime;
          }
        }
      );
      //console.log('task.histIndex.OPENED: ', task.histIndex.OPENED);
      //console.log('task.histIndex.DEADLINE: ', task.histIndex.DEADLINE);
    }
  );

  const deltaTime = maxTime - minTime;

  console.log('tasks: ', tasks);
  //console.log('minTime: ', minTime);
  //console.log('maxTime: ', maxTime);
  //console.log('delta: ', Math.round((maxTime-minTime)/100));



  return (
    <div className={classes.root}>
      <div className={classes.content}>

        { tasks.map(task => generateLine(task, deltaTime, minTime)) }

      </div>
    </div>
  );

};
