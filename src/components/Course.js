import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardHeader, IconButton } from "@material-ui/core";
import DeleteSharpIcon from '@material-ui/icons/DeleteSharp';
import { connect } from "react-redux";
import { deleteCourse } from "../actions/courseActions";
import { editCourse } from "../actions/courseActions";
import Tooltip from '@material-ui/core/Tooltip';
import CheckIcon from '@material-ui/icons/Check';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '3px',
    cursor: 'pointer'
  },
  highlightCourseName: {
    color: '#00863f',
    fontWeight: 700,
    display: 'inline',
  },
  invalidHighlight: {
    color: 'red',
    fontWeight: 700,
    display: 'inline',
  },
  showDelete: {
    display: 'block',
    width: 4,
    opacity: 0.6,
    '&:hover': {
      opacity: 0.9,
    },
    marginRight: 17,
  },
  hideDelete: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  }
}));

const Course = (props) => {
  let { dispatch, courseName, yearIndex, semesterIndex, courseIndex, valid } = props;
  const classes = useStyles();
  const [state, setState] = useState({ isHovering: false, manualApproved: false });
  const handleHover = () => {
    setState({
      ...state,
      isHovering: !state.isHovering
    });
  };

  const setValid = () => {
    setState({
      ...state,
      manualApproved: !state.manualApproved
    });
    console.log(state.manualApproved)
    dispatch(editCourse(yearIndex, semesterIndex, courseIndex));
  }

  const handleDelete = () => {
    dispatch(deleteCourse(yearIndex, semesterIndex, courseIndex));
  };

  let coursePrefix = "";
  const pattern = new RegExp(/[A-Z]+ \d{4}|\d{3} Core Course/);

  if (pattern.test(courseName)) {
    coursePrefix = courseName.match(pattern);
    courseName = courseName.split(coursePrefix)[1];
  }

  return (
    <div className={classes.root}>
      <Card
        onMouseEnter={handleHover}
        onMouseLeave={handleHover}
        elevation={3}
      >
        <CardHeader
          title={
            <>
              <Tooltip interactive
                title={
                  valid === '1' ? '' :
                    <React.Fragment>
                      {valid}
                      <IconButton size="small" onClick={setValid}><CheckIcon /></IconButton>
                    </React.Fragment>
                } placement="top-start">
                <div className={valid === '1' ? classes.highlightCourseName : classes.invalidHighlight}>{coursePrefix}</div>
              </Tooltip>
              {courseName}
            </>
          }
          titleTypographyProps={{ variant: 'body2' }}
          action={
            <>
              <div className={state.isHovering ? classes.showDelete : classes.hideDelete} onClick={handleDelete}>
                <DeleteSharpIcon fontSize={'small'} />
              </div>
            </>
          }
          style={{ padding: 10 }}
        >
        </CardHeader>
      </Card>
    </div>
  );
}

export default connect()(Course);