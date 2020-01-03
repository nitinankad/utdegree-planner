import React from "react";
import { AppBar, Toolbar, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: '#c75b12',
  },
}));
  
const Topbar = () => {
  const classes = useStyles();

  return (
    <AppBar position="fixed" className={classes.root}>
      <Toolbar>
        <Typography variant="h6" noWrap>
          UTDegree Planner
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;