import React from "react";
import { makeStyles } from "@material-ui/core";
import Drawer from '@material-ui/core/Drawer';
import LoadCourses from './LoadCourses';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  drawer: {
    width: drawerWidth,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  toolbar: theme.mixins.toolbar,
}));
  
const Sidebar = () => {
  const classes = useStyles();
  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.toolbar} />
      <LoadCourses />
    </Drawer>
  );
};

export default Sidebar;