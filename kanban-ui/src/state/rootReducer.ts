import { combineReducers } from "redux";

import taskReducer from "./taskSlice";
import boardReducer from "./boardSlice";

const rootReducer = combineReducers({
  boards: boardReducer,
  tasks: taskReducer,
});

export default rootReducer;
