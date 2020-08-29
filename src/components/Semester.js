import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  RootRef
} from '@material-ui/core';
import Course from './Course';
import { Draggable, Droppable } from "react-beautiful-dnd";
import AddCourseButton from '../views/components/AddCourseButton';
import { useHistory } from "react-router-dom";

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
    cursor: 'pointer'
  },
  addCourse: {
    textTransform: 'none',
    padding: 0,
  }
}));

const Semester = (props) => {
  const { semesterName, courses, semesterId, yearIndex, semesterIndex } = props;
  const classes = useStyles();
  let history = useHistory();

  function handleClick() {
    // history.push("/" + yearIndex + "/" + semesterIndex)
  }

  return (
    <Card
      className={classes.root}
      onClick={handleClick}
    >
        <CardHeader
            className={classes.cardHeaderStyle}
            title={semesterName}
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