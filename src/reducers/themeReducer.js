import { actionTypes } from "../constants/actionTypes";

const initialState = {
  darkMode: false
};

const themeReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.TOGGLE_DARK_MODE: {
      return {
        ...state,
        darkMode: !state.darkMode
      };
    }
    default: {
      return state;
    }
  }
};

export default themeReducer;
