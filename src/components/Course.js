import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardHeader } from "@material-ui/core";
import DeleteSharpIcon from '@material-ui/icons/DeleteSharp';
import { connect } from "react-redux";
import { deleteCourse } from "../actions/courseActions";

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
    display: 'none',
	[theme.breakpoints.down('sm')]: {
      display: 'block',
		width: 4,
		opacity: 0.6,
		'&:hover': {
		  opacity: 0.9,
		},
		marginRight: 17,
    },
  }
}));

const Course = (props) => {
  let { dispatch, courseName, yearIndex, semesterIndex, courseIndex } = props;
  const classes = useStyles();
  const [state, setState] = useState({isHovering: false});

  const handleHover = () => {
    setState({
      ...state,
      isHovering: !state.isHovering
    });
  };

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
              <div className={classes.highlightCourseName}>{coursePrefix}</div>
              {courseName}
            </>
          }
          titleTypographyProps={{ variant:'body2' }}
          action={
            <>
              <div className={state.isHovering ? classes.showDelete : classes.hideDelete} onClick={handleDelete}>
                <DeleteSharpIcon fontSize={'small'} />
              </div>
            </>
          }
          style={{padding: 10}}
        >
        </CardHeader>
      </Card>
    </div>
  );
}

export default connect()(Course);