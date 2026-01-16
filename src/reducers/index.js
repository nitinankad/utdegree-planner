import boardReducer from './boardReducer';
import themeReducer from './themeReducer';
import { combineReducers } from "redux";

export default combineReducers({
  board: boardReducer,
  theme: themeReducer
});