import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  Button, Card, Icon
} from '@material-ui/core';
import TextArea from "react-textarea-autosize";
import { connect } from 'react-redux';
import { addCourse } from "../../actions/courseActions";

const useStyles = makeStyles(() => ({
  root: {
    textTransform: 'none', padding: 0,
  },
  addCourseForm: {
    textTransform: 'none',
    padding: 0,
    backgroundColor: '#5aac44',
    color: 'white',
    paddingRight: 6,
    paddingLeft: 6,
    '&:hover': {
      backgroundColor: '#72c45c',
    },
  },
  closeIcon: {
    '&:hover': {
      backgroundColor: '#ebebeb',
    },
  },
  cardStyle: {
    overflow: 'visible',
    minHeight: 30,
    minWidth: 202,
    padding: '6px 8px 2px',
  },
  textAreaStyle: {
    resize: 'none',
    width: '100%',
    overflow: 'hidden',
    outline: 'none',
    border: 'none',
  }
}));

const AddCourseButton = (props) => {
  const { dispatch, yearIndex, semesterIndex } = props;
  const classes = useStyles();
  const [state, setState] = useState({
    isOpen: false,
    text: ''
  });

  const handleOpenForm = () => {
    setState({
      ...state,
      isOpen: !state.isOpen
    });
  };

  // Clicked outside while add course form is open
  const handleClickOutside = () => {
    const courseName = state.text;
    dispatch(addCourse(courseName, yearIndex, semesterIndex));

    setState({
      isOpen: !state.isOpen,
      text: ''
    });
  }

  const handleKeyEnter = (event) => {
    if (event.key === "Enter") {
      handleClickOutside();
    }
  }

  const handleTextChange = (e) => {
    setState({
      ...state,
      text: e.target.value
    });
  };

  const handleAddCourseClick = () => {
    if (state.text) {
      setState({
        ...state, 
        text: ''
      })
    }
  };

  const renderButton = () => {
    return (
      <Button className={classes.root} onClick={handleOpenForm}>
        <Icon>add</Icon>Add course
      </Button>
    );
  };

  const renderForm = () => {
    return (
      <>
        <Card
          className={classes.cardStyle}
          onBlur={handleClickOutside}
        >
          <TextArea
            className={classes.textAreaStyle}
            autoFocus
            placeholder={'Enter a course name'}
            value={state.text}
            onChange={handleTextChange}
            onKeyPress={handleKeyEnter}
           />
        </Card>
        <Button className={classes.addCourseForm} onClick={handleAddCourseClick}>Add course</Button>
        <Icon className={classes.closeIcon} onClick={handleOpenForm}>close</Icon>
      </>
    );
  };

  return (
    <>
      {state.isOpen ? renderForm() : renderButton()}
    </>
  );
};

export default connect()(AddCourseButton);