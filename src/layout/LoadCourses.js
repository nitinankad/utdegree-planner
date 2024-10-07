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
import Button from '@material-ui/core/Button';
import degreeData from "../constants/degreePlans";
import { loadJsonCourses, exportCourses } from "../actions/courseActions";
import { useHistory } from "react-router-dom";

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
  let history = useHistory();

  const redirectGraph = () => {
    // history.push("/" + yearIndex + "/" + semesterIndex)
    history.push("/graph");
  }

  const redirectTable = () => {
    history.push("/table");
  };

  const [state, setState] = useState({
    openMenu: false,
    needUpdate: false
  });

  const handleExport = () => {
    // exports the board as a JSON object for importing later on
    // currently sends out an alert from the dispatched function
    dispatch(exportCourses());
  }

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

  const handleDegreeUpload = (e) => {
    console.log('degree uploaded!');
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
      var deg = e.target.result;
      dispatch(loadJsonCourses(deg));
    };
    reader.readAsText(file);
  }

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
                <ListItemText primary={school.schoolName} classes={{ primary: classes.listItemText }} />
              </ListItem>
              {Object.keys(school.degreePlans).map((degree, degreeIndex) => (
                <div key={degree}>
                  <ListItem button className={classes.listItem} onClick={e => handleLoadDegreePlan(e, schoolIndex)}>
                    <ListItemIcon>
                      <SchoolIcon />
                    </ListItemIcon>
                    <ListItemText primary={degree} classes={{ primary: classes.listItemText }} />
                  </ListItem>
                </div>
              ))}
            </div>
          ))}
        </List>
      </Collapse>
      <ListItem>
        <input
          accept="text/plain"
          className={classes.input}
          style={{ display: 'none' }}
          id="file"
          type="file"
          onChange={e => handleDegreeUpload(e)}
        />
        <label htmlFor="file">
          <Button variant="contained" component="span" className={classes.button}>
            Import
          </Button>
        </label>
      </ListItem>
      <ListItem>
        <Button variant="contained" onClick={handleExport}>Export</Button>
      </ListItem>
      <ListItem>
        <Button variant="contained" color="primary" onClick={redirectGraph}>Show Graph</Button>
      </ListItem>
      <ListItem>
        <Button variant="contained" color="primary" onClick={redirectTable}>Show Table</Button>
      </ListItem>
    </List >
  );
};

export default connect()(LoadCourses);