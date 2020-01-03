import React from "react";
import { AppBar, Toolbar, Typography, makeStyles, IconButton } from '@material-ui/core';
import MenuIcon from "@material-ui/icons/Menu";

const useStyles = makeStyles(theme => ({
  root: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: '#c75b12',
  },
  menuIcon: {
    marginRight: theme.spacing(1),
    [theme.breakpoints.up("sm")]: {
      display: 'none'
    },
  },
}));
  
const Topbar = (props) => {
  const classes = useStyles();
  const { onSidebarOpen } = props;

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

        <Typography variant="h6" noWrap>
          UTDegree Planner
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;