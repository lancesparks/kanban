import { combineReducers } from "redux";
import boardReducer from "./boardSlice";

const rootReducer = combineReducers({
  boards: boardReducer,
});

export default rootReducer;
