import React, { useState } from "react";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CircularProgress from '@material-ui/core/CircularProgress';
import GetAppIcon from '@material-ui/icons/GetApp';
import { Collapse, makeStyles } from '@material-ui/core';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import SchoolIcon from '@material-ui/icons/School';
import { connect } from 'react-redux';
import { setBoard } from "../actions/boardActions";
import degreePlans from "../constants/degreePlans";

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
    openMenu: false,
    isLoading: false
  });

  const handleClick = () => {
    setState({
      ...state,
      openMenu: !state.openMenu
    });
  };

  // TODO: Handle errors when fetching from API
  const fetchCourses = (selectedDegreeName) => {
    return fetch(process.env.REACT_APP_API_URL, {
      method: 'post',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ degreeName: selectedDegreeName })
    }).then(response => {
      return response.json();
    }).then(data => {
      dispatch(setBoard(data));
    });
  }

  const waitForFetch = (selectedDegreeName) => {
    return Promise.all([fetchCourses(selectedDegreeName)]);
  }

  const handleLoadDegreePlan = (e) => {
    const selectedDegreeName = e.target.textContent;
    setState({
      ...state,
      isLoading: true
    });

    waitForFetch(selectedDegreeName).then((val) => {
      setState({
        ...state,
        isLoading: false
      });
    });
  };

  return (
    <List>
      <ListItem button onClick={handleClick}>
        <ListItemIcon>
          {state.isLoading ? <CircularProgress /> : <GetAppIcon />}
        </ListItemIcon>
        
        <ListItemText primary={`Load courses`} />
        {state.openMenu ? <ExpandLess /> : <ExpandMore />}
      </ListItem>

      <Collapse in={state.openMenu} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
        {degreePlans.map((school, schoolIndex) => (
            <div key={schoolIndex}>
              <ListItem button className={classes.subheaderListItem}>
                <ListItemText primary={school.schoolName} classes={{primary:classes.listItemText}} /> 
              </ListItem>

              {school.degreePlans.map((degree, degreeIndex) => (
                <div key={degree}>
                  <ListItem button disabled={state.isLoading} className={classes.listItem} onClick={handleLoadDegreePlan}>
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