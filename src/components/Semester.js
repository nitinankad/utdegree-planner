import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  RootRef,
  Typography
} from '@material-ui/core';
import Course from './Course';
import { Draggable, Droppable } from "react-beautiful-dnd";
import AddCourseButton from '../views/components/AddCourseButton';

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.down('md')]: {
      'margin-top': '10px',
    },
  },
  content: {
    width: '100%',
  },
  cardHeaderStyle: {
    textAlign: 'center',
    padding: 7,
  },
  addCourse: {
    textTransform: 'none',
    padding: 0,
  }
}));

const Semester = (props) => {
  const { semesterName, courses, semesterId, yearIndex, semesterIndex, hours } = props;
  const classes = useStyles();

  return (
    <Card
      className={classes.root}
    >
      <CardHeader
        className={classes.cardHeaderStyle}
        title={semesterName}
        subheader={
          <Typography variant="caption">
            {hours} Credit Hours
          </Typography>
        }
        titleTypographyProps={{ variant: 'h6' }}
      />
      <Divider />

      <Droppable droppableId={semesterId} type={`droppableSemester`}>
        {provided => (
          <RootRef rootRef={provided.innerRef}>
            <CardContent>
              {courses.map((course, index) => (
                <Draggable key={course.id} draggableId={course.id} index={index}>
                  {provided => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Course
                        courseName={course.courseName}
                        yearIndex={yearIndex}
                        semesterIndex={semesterIndex}
                        courseIndex={index}
                        valid={course.valid === undefined ? '1' : course.valid}
                        manualApprove={course.manualApprove}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </CardContent>
          </RootRef>
        )}

      </Droppable>

      <Divider />

      <CardActions>
        <AddCourseButton
          yearIndex={yearIndex}
          semesterIndex={semesterIndex}
        />
      </CardActions>

    </Card>
  );
};

export default Semester;