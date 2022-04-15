import React from 'react'
import {
  Box,
  CircularProgress
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: theme.palette.primary.main,
    position: 'fixed',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}))

const ScreenLocker = () => {
  const classes = useStyles()
  return (
    <Box className={classes.backdrop}>
      <CircularProgress color="inherit" />
    </Box>
  )
}

export default ScreenLocker