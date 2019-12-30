import { actionTypes } from "../constants/actionTypes";

export const handleDrag = (result) => {
  return {
    type: actionTypes.DRAG_EVENT,
    payload: {
      result
    }
  };
}; 