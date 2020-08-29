import { actionTypes } from "../constants/actionTypes";

export const setBoard = (newBoard) => {
  return {
    type: actionTypes.SET_BOARD,
    payload: {
      newBoard
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