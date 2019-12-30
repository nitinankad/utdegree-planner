import boardReducer from './boardReducer';
import { combineReducers } from "redux";

export default combineReducers({
  board: boardReducer
});