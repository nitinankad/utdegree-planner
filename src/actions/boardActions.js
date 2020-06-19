import { actionTypes } from "../constants/actionTypes";

export const setBoard = (newBoard) => {
  return {
    type: actionTypes.SET_BOARD,
    payload: {
      newBoard
    }
  }
};
