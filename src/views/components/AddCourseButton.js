import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import {
  Button, Card, Icon
} from '@material-ui/core';
import { connect } from 'react-redux';
import { addCourse } from "../../actions/courseActions";
import * as courses from "../../constants/courses";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { createFilterOptions } from '@material-ui/lab/Autocomplete';

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
  smallFont: {
	fontSize: '12px',
  },
  closeIcon: {
    '&:hover': {
      backgroundColor: '#ebebeb',
    },
  },
  cardStyle: {
    overflow: 'visible',
    minHeight: 30,
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
    const courseName = state.text.trim();

    setState({
      isOpen: !state.isOpen,
      text: ''
    });

    if (!courseName) return;

    dispatch(addCourse(courseName, yearIndex, semesterIndex));
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
  
  const handleAutofill = (val) => {
    setState({
      ...state,
      text: val
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
  
  const filterOptions = createFilterOptions({
  limit: 20
});
  
  const renderForm = () => {
    return (
      <>
        <Card
          className={classes.cardStyle}
          onBlur={handleClickOutside}
        >
          
		   <Autocomplete
			  id="autofill"
			  filterOptions={filterOptions}
			  options={courses.courses}
			  getOptionLabel={(option) => option.name}
			  style={{ width: 200 }}
			  onInputChange={(event, newInputValue) => {
			    handleAutofill(newInputValue)
			  }}
			  renderInput={(params) => <TextField {...params} label="Course Name" autoFocus onChange={handleTextChange} onKeyPress={handleKeyEnter} value={state.text}/>}
			  renderOption={(option, { selected }) => (
				<Typography className={classes.smallFont}>{option.name}</Typography>
				)}
			/>
		   
        </Card>
        <Button className={classes.addCourseForm} onClick={handleAddCourseClick}>Add </Button>
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