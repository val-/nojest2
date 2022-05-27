import React from 'react';
import {
  Button,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
} from '@material-ui/core';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';


const useStyles = makeStyles(theme => ({

  root: {
    width: theme.spacing(60),
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
  },

  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '80%',
    flexShrink: 0,
  },

  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
    minWidth: theme.spacing(12),
  },

  card: {
    marginBottom: theme.spacing(4),
  },

  footer: {
    padding: theme.spacing(1.5),
  }

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
        <Typography className={classes.secondaryHeading}>{ task.status }</Typography>
        <Typography className={classes.heading}>{ task.title }</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          { task.description }
        </Typography>
      </AccordionDetails>
    </Accordion>
  );

  console.log('tasks: ', tasks);

  const taskIdSorter = (a, b) => {
    if (a.id > b.id) {
      return -1;
    } else if (a.id < b.id) {
      return 1;
    } else {
      return 0;
    }
  };

  const tasksFiltered = tasks.sort(taskIdSorter).filter((t, n) => n < 8);

  return (
    <div className={classes.root}>
      <div className={classes.content}>

        <Card square className={classes.card}>
          <CardActionArea onClick={() => { openPage('tasks'); }}>
            <CardMedia className={classes.media} title="Let`s view tasks">
              <img src="static/images/clip/create.jpg" alt="Let`s view tasks"/>
            </CardMedia>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Actual tasks
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                View personal tasks by user. Direct task team chat.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>

        { tasksFiltered.map(generateAccordion) }

        <div className={classes.footer}>
            <Button size="small" color="primary" onClick={() => { openPage('tasks'); }}>
              View all tasks ({ tasks.length })
            </Button>
        </div>
      </div>
    </div>
  );

};
