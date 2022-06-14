import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  List,
} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import moment from 'moment';
import UserPic from '../components/userPic';
import StatusLabel from '../components/statusLabel';
import generateRandomText from '../utils/generateRandomText';

import { backendService as backend } from '../services/backendService';

const useStyles = makeStyles(theme => ({
  messagesContainer: {
    borderTop: 'rgba(0,0,0,0.3) 1px solid',
    background: 'rgba(0,0,0,0.17)',
  },
  messageForm: {
    borderTop: 'rgba(0,0,0,0.3) 1px solid',
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2, 2, 2, 9),
  },
  messageField: {
    background: 'none',
    display: 'block',
    border: 'none',
    color: theme.palette.text.primary,
    outline: 'none',
    flexGrow: 1,
    fontSize: '1rem',
    '&::placeholder': {
      color: theme.palette.text.primary,
      opacity: 1,
    }
  },
  sendButton: {
    marginLeft: theme.spacing(4),
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    outline: 'none',
    '&:disabled': {
      opacity: 0.5,
    },
  },
  sendIcon: {
    color: theme.palette.primary.main,
  },
  listItemText: {
    '& .MuiListItemText-secondary': {
      opacity: 0.5,
    }
  },
  status: {
    background: theme.palette.primary.light,
  },
}));

export default function Chat({ task }) {
  const classes = useStyles();
  const [messageState, setMessage] = useState('');
  const [lettersState, setLetters] = useState([]);
  const [initStartedState, setInitStarted] = useState(false);

  useEffect(() => {

    const getHistoryRecordAuthor = status => {
      if (
        status === 'ASSIGNED' ||
        status === 'RESOLVED'
      ) {
        return task.contractorId;
      } else if (
        status === 'OPENED' ||
        status === 'REOPENED' ||
        status === 'DONE'
      ) {
        return task.taskAuthorId;
      } else {
        return -1;
      }
    };

    const mergeLettersWithHistory = (letters=[], history=[]) => {
      return letters.map(msg => ({
        authorId: msg.authorId,
        dateTime: msg.dateTime,
        letter: msg.letter,
      })).concat(history.map(rec => ({
        authorId: getHistoryRecordAuthor(rec.status),
        dateTime: rec.dateTime,
        isStatusRecord: true,
        letter: rec.status,
      }))).sort(dateTimeSorter);
    };

    const updateLetters = () => {
      backend.getLettersByTask(task.id).then(resp => {
        setLetters(mergeLettersWithHistory(resp, task.history));
        updateScroll();
        backend.waitLettersByTask(task.id).then(updateLetters);
      });
    };

    if (!initStartedState) {
      setInitStarted(true);
      updateLetters();
    }

  }, [initStartedState, task, lettersState]);

  const dateTimeSorter = (a, b) => {
    const A = moment(a.dateTime);
    const B = moment(b.dateTime);
    if (A.isAfter(B)) {
      return 1;
    } else if (B.isAfter(A)) {
      return -1;
    } else {
      return 0;
    }
  };

  const updateScroll = () => {
    const root = document.documentElement;
    root.scrollTop = root.scrollHeight;
  };

  const doSendMessage = text => {
    backend.sendMessage({
      taskId: task.id,
      letter: text,
    }).then(() => {
      setMessage('');
      /*
      backend.getLettersByTask(task.id).then(resp => {
        setLetters(mergeLettersWithHistory(resp, task.history));
        updateScroll();
      });
      */
    });
  };

  const sendHandler = event => {
    event.preventDefault();
    doSendMessage(messageState);
  };

  const messageKeyDownHandler = event => {
    if (event.ctrlKey && event.keyCode === 77) {
      setInterval(() => {
        doSendMessage(generateRandomText());
      }, 500)
    }
  };

  const messageChangeHandler = event => {
    event.persist();
    setMessage(event.target.value);
  };

  const renderLetter = (message, messageIndex) => (
    <ListItem key={messageIndex}>
      <ListItemAvatar>
        <UserPic userId={message.authorId}/>
      </ListItemAvatar>
      <ListItemText
        className={classes.listItemText}
        primary={
          message.isStatusRecord ?
          <StatusLabel status={message.letter} variant="wide"/> :
          message.letter
        }
        secondary={ moment(message.dateTime).fromNow() }
      />
    </ListItem>
  );

  return (
    <>
      {
        lettersState.length !== 0 &&
        (
          <List className={classes.messagesContainer}>
            { lettersState.map(renderLetter) }
          </List>
        )
      }
      <form
        className={classes.messageForm}
        onSubmit={sendHandler}
      >
        <input
          className={classes.messageField}
          placeholder="Write your message here"
          name="message"
          type="text"
          value={messageState}
          autoComplete="off"
          onChange={messageChangeHandler}
          onKeyDown={messageKeyDownHandler}
        />
        <button
          type="submit"
          disabled={messageState === ''}
          className={classes.sendButton}
        >
          <SendIcon className={classes.sendIcon} fontSize="large"/>
        </button>
      </form>
    </>
  );
}