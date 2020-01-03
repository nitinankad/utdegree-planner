import React from "react";
import { makeStyles, Hidden } from "@material-ui/core";
import Drawer from '@material-ui/core/Drawer';
import LoadCourses from './LoadCourses';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
    },
  },
  drawerPaper: {
    width: drawerWidth,
  },
  toolbar: theme.mixins.toolbar,
}));
  
const Sidebar = (props) => {
  const classes = useStyles();
  const { onSidebarClose, open } = props;
  return (
    <>
      <Hidden smUp implementation="css">
        <Drawer
          className={classes.drawer}
          variant="temporary"
          classes={{
            paper: classes.drawerPaper,
          }}
          open={open}
          onClose={onSidebarClose}
          ModalProps={{
            keepMounted: true
          }}
        >
          <LoadCourses />
        </Drawer>
      </Hidden>

      <Hidden xsDown implementation="css">
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
          open
        >
          <div className={classes.toolbar} />
          <LoadCourses />
        </Drawer>
      </Hidden>
    </>
  );
};

export default Sidebar;