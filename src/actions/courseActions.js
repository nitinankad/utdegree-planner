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

export const editCourse = (yearIndex, semesterIndex, courseIndex) => {
  return {
    type: actionTypes.EDIT_COURSE,
    payload: {
      yearIndex, semesterIndex, courseIndex
    }
  }
};

export const loadJsonCourses = (json) => {
  return {
    type: actionTypes.LOAD_COURSE,
    payload: {
      json
    }
  }
};

export const exportCourses = () => {
  return {
    type: actionTypes.EXPORT_COURSES,
    payload: {
      
    }
  }
};

export const exportToExcel = () => {
  return {
    type: actionTypes.EXPORT_TO_EXCEL,
    payload: {
      
    }
  }
};