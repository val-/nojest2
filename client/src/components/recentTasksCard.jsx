import React, { useState, useEffect } from 'react';
import {
  Button,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '@material-ui/core';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useHistory } from 'react-router-dom';
import { backendService as backend } from '../services/backendService';
import { makeStyles } from '@material-ui/styles';


const useStyles = makeStyles(theme => ({

  root: {
    width: theme.spacing(60),
    margin: theme.spacing(12, 4),
    display: 'flex',
    flexDirection: 'column',
  },

  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },

  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },

}));

export default function RecentTasksCard({ tasks }) {

  const classes = useStyles();
  const history = useHistory();

  const openPage = code => {
    history.push(`/${code}`);
  }


  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const generateAccordion = task => (
    <Accordion key={task.id} expanded={expanded === `panel_${task.id}`} onChange={handleChange(`panel_${task.id}`)}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={ `panel_${task.id}bh-content` }
        id={ `panel_${task.id}bh-header` }
      >
        <Typography className={classes.heading}>{ task.title }</Typography>
        <Typography className={classes.secondaryHeading}>{ task.status }</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          { task.description }
        </Typography>
      </AccordionDetails>
    </Accordion>
  );

  console.log('tasks: ', tasks);

  return (
    <div className={classes.root}>
      <div className={classes.content}>

        { tasks.map(generateAccordion) }

      </div>
      <div className={classes.footer}>
        <Button size="small" color="primary" onClick={() => { openPage('create-task'); }}>
          New task
        </Button>
      </div>
    </div>
  );

};
