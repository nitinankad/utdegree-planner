import { actionTypes } from "../constants/actionTypes";

export const setBoard = (newBoard) => {
  return {
    type: actionTypes.SET_BOARD,
    payload: {
      newBoard
    }
  }
};

export const addExtraYear = () => {
  return {
    type: actionTypes.ADD_EXTRA_YEAR,
    payload: {}
  }
};

export const deleteExtraYear = (yearIndex) => {
  return {
    type: actionTypes.DELETE_EXTRA_YEAR,
    payload: {
      yearIndex
    }
  }
};

export const addPDFCourses = (courses) => {
  return {
    type: actionTypes.ADD_PDF_COURSES,
    payload: {
      courses
    }
  }
};
