import { actionTypes } from "../constants/actionTypes";

export const addCourse = (courseName, yearIndex, semesterIndex) => {
  return {
    type: actionTypes.ADD_COURSE,
    payload: {
      courseName, yearIndex, semesterIndex
    }
  }
};

export const deleteCourse = (yearIndex, semesterIndex, courseIndex) => {
  return {
    type: actionTypes.DELETE_COURSE,
    payload: {
      yearIndex, semesterIndex, courseIndex
    }
  }
};