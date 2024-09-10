import { configureStore } from "@reduxjs/toolkit"; // Add this import
import { thunk } from "redux-thunk";
import rootReducer from "./rootReducer";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export type AppDispatch = typeof store.dispatch;
export default store;
