import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Semester from './Semester';

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
    width: '100%',
  },
  semester: {
    userSelect: 'none',
    padding: '0px',
    margin: `0 10px 0 0`,
    width: '100%',
  }
}));

const Year = (props) => {
  const classes = useStyles();
  const { semesters, yearIndex } = props;
  return (
    <div className={classes.root}>
      {semesters.map((semester, index) => (
        <div className={classes.semester} key={semester.id}>
          <Semester
            semesterName={semester.semesterName}
            courses={semester.courses}
            semesterId={semester.id}
            yearIndex={yearIndex}
            semesterIndex={index}
            hours={semester.hours}
          />
        </div>
      ))}
    </div>
  );
}

export default Year;