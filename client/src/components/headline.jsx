import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useHistory } from 'react-router-dom';
import { ReactComponent as Logo } from '../assets/logo.svg';
import AccountIcon from '@material-ui/icons/AccountBalanceWallet';
import { backendService as backend } from '../services/backendService';
import { utilsService as utils } from '../services/utilsService';
import UserPicSelf from './userPicSelf';


const useStyles = makeStyles(theme => ({
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    background: theme.palette.background.paper,
  },
  logoBox: {
    padding: theme.spacing(1, 0)
  },
  logoIcon: {
    display: 'block',
    width: '150px',
  },
  rightBox: {
    display: 'flex',
    justifyContent : 'flex-end',
    alignItems: 'center',
  },
  rightBoxCell: {
    paddingLeft: theme.spacing(4),
  }
}));

const Headline = () => {

  const classes = useStyles();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [userState, setUserState] = useState({ initialized: false });

  useEffect(() => {
    if (!userState.initialized) {
      const { authorizedUser } = backend.getSessionContext();
      setUserState({
        avatar: authorizedUser.avatar,
        fullName: authorizedUser.fullName,
        balance: authorizedUser.balance,
        initialized: true
      });
    }
  }, [userState]);

  const handleLogout = () => {
    backend.logout().then(() => {
      window.location.reload();
    });
  }

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openProfile = () => {
    history.push('/profile');
  };

  return (
    <AppBar>
      <Toolbar className={classes.row}>
        <a href="/" className={classes.logoBox}>
          <Logo className={classes.logoIcon} />
        </a>
        <div className={classes.rightBox}>
          <div className={classes.rightBoxCell}>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <UserPicSelf userInfo={userState} />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={openProfile}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
            { userState.fullName }
          </div>
          <div className={classes.rightBoxCell}>
            <IconButton>
              <AccountIcon/>
            </IconButton>
            { utils.formatPrice(userState.balance) }
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );

}

export default Headline;
