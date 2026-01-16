import React from "react";
import { AppBar, Toolbar, Typography, makeStyles, IconButton } from '@material-ui/core';
import MenuIcon from "@material-ui/icons/Menu";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import { useSelector, useDispatch } from 'react-redux';
import { actionTypes } from "../constants/actionTypes";

const useStyles = makeStyles(theme => ({
  root: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: theme.palette.primary.main,
  },
  menuIcon: {
    marginRight: theme.spacing(1),
    [theme.breakpoints.up("sm")]: {
      display: 'none'
    },
  },
  title: {
    flexGrow: 1,
  },
}));

const Topbar = (props) => {
  const classes = useStyles();
  const { onSidebarOpen } = props;
  const darkMode = useSelector((state) => state.theme.darkMode);
  const dispatch = useDispatch();

  const handleToggleDarkMode = () => {
    dispatch({ type: actionTypes.TOGGLE_DARK_MODE });
  };

  return (
    <AppBar position="fixed" className={classes.root}>
      <Toolbar>
        <IconButton
          color="inherit"
          onClick={onSidebarOpen}
          className={classes.menuIcon}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" noWrap className={classes.title}>
          UTDegree Planner
        </Typography>

        <IconButton color="inherit" onClick={handleToggleDarkMode}>
          {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;