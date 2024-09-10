import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { ISubtask, ITask } from "../interfaces";
import axios from "axios";
export interface BoardState {
  boards: any[];
  columns: string[];
}

const initialState: BoardState = {
  boards: [],
  columns: [],
};

export const boardSlice = createSlice({
  name: "board",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addColumn: (state, action: PayloadAction<any[]>) => {
      state.columns = action.payload;
    },
    addBoard: (state, action: PayloadAction<any[]>) => {
      state.boards = action.payload;
    },
  },
});

export const boardActions = boardSlice.actions;

export default boardSlice.reducer;
