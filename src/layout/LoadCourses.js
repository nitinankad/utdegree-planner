import React, { useState } from "react";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import GetAppIcon from '@material-ui/icons/GetApp';
import { Collapse, makeStyles } from '@material-ui/core';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import SchoolIcon from '@material-ui/icons/School';
import { connect } from 'react-redux';
import { setBoard } from "../actions/boardActions";
import degreeData from "../constants/degreePlans";

const useStyles = makeStyles(theme => ({
  listItem: {
    paddingLeft: theme.spacing(4)
  },
  listItemText: {
    fontSize: 14,
  },
  subheaderListItem: {
    backgroundColor: "#FFF",
    "&:hover": {
      backgroundColor: "#FFF",
    },
  },
}));

const LoadCourses = (props) => {
  const { dispatch } = props;
  const classes = useStyles();
  const [state, setState] = useState({
    openMenu: false
  });

  const handleClick = () => {
    setState({
      ...state,
      openMenu: !state.openMenu
    });
  };

  const handleLoadDegreePlan = (e, schoolIndex) => {
    const selectedDegreeName = e.target.textContent;

    dispatch(setBoard(degreeData[schoolIndex].degreePlans[selectedDegreeName]));
  };

  return (
    <List>
      <ListItem button onClick={handleClick}>
        <ListItemIcon>
          <GetAppIcon />
        </ListItemIcon>
        
        <ListItemText primary={`Load courses`} />
        {state.openMenu ? <ExpandLess /> : <ExpandMore />}
      </ListItem>

      <Collapse in={state.openMenu} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
        {degreeData.map((school, schoolIndex) => (
            <div key={school.schoolName}>
              <ListItem button className={classes.subheaderListItem}>
                <ListItemText primary={school.schoolName} classes={{primary:classes.listItemText}} /> 
              </ListItem>

              {Object.keys(school.degreePlans).map((degree, degreeIndex) => (
                <div key={degree}>
                  <ListItem button className={classes.listItem} onClick={e => handleLoadDegreePlan(e, schoolIndex)}>
                    <ListItemIcon>
                      <SchoolIcon />
                    </ListItemIcon>

                    <ListItemText primary={degree} classes={{primary:classes.listItemText}} />
                  </ListItem>
                </div>
              ))}
            </div>
          ))}
        </List>
      </Collapse>

    </List>
  );
};

export default connect()(LoadCourses);