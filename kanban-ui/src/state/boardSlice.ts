import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";
import { ISubtask, ITask, IColumnStatus } from "../interfaces";
import { createBoard, updateBoard } from "./board-action";
export interface BoardState {
  boards: any[];
  boardStatuses: IColumnStatus[];
  columns: any[];
  tasks: ITask[];
  selectedTask: ITask | null;
  selectedBoard: any | null;
  statuses: string[];
  isDarkMode: boolean;
}

const initialState: BoardState = {
  boards: [],
  boardStatuses: [],
  columns: [],
  tasks: [],
  selectedTask: null,
  selectedBoard: null,
  statuses: [],
  isDarkMode: true,
};

export const boardSlice = createSlice({
  name: "board",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setSelectedBoard: (state, action: PayloadAction<any>) => {
      state.selectedBoard = action.payload;
    },
    updateBoard: (state, action: PayloadAction<any>) => {
      state.boards = [
        ...state.boards.map((board) => {
          if (board.ID === action.payload.board.ID) {
            return {
              ...action.payload.board,
              columns: action.payload.columns,
            };
          }
          return board;
        }),
      ];

      state.selectedBoard = action.payload.board;
      state.columns = action.payload.columns.sort(
        (a: any, b: any) => a.ID - b.ID
      );
    },
    updateColumn: (state, action: PayloadAction<any[]>) => {
      state.columns = action.payload.sort((a: any, b: any) => a.ID - b.ID);
    },
    addColumns: (state, action: PayloadAction<any[]>) => {
      state.columns = action.payload.sort((a: any, b: any) => a.ID - b.ID);
    },
    addBoardStatuses: (state, action: PayloadAction<any[]>) => {
      state.boardStatuses = action.payload;
    },
    addCreatedBoard: (state, action: PayloadAction<any>) => {
      state.boards = [...state.boards, action.payload];
    },
    addBoard: (state, action: PayloadAction<any[]>) => {
      state.boards = action.payload.sort((a: any, b: any) => a.ID - b.ID);
    },
    setStatuses: (state, action: PayloadAction<string[]>) => {
      state.statuses = action.payload;
    },
    setSelectedTask: (state, action: PayloadAction<ITask>) => {
      state.selectedTask = action.payload;
    },
    addTasks: (state, action: PayloadAction<ITask[]>) => {
      state.tasks = action.payload;
    },
    updateTitle: (state, action: PayloadAction<string>) => {
      state.tasks = [...state.tasks, { ...state.tasks[0] }];
    },
    updateDescription: (state, action: PayloadAction<string>) => {
      let updatedTask = { ...state.tasks[0], description: action.payload };
      state.tasks = [...state.tasks, updatedTask];
    },
    updateStatus: (state, action: PayloadAction<string>) => {
      let updatedTask = { ...state.tasks[0], description: action.payload };
      state.tasks = [...state.tasks, updatedTask];
    },
    updateTasks: (state, action: PayloadAction<any>) => {
      let updatedTask = { ...action.payload.task };
      state.columns = [
        ...action.payload.columns
          .map((col: any) => {
            return {
              ...col,
              tasks: col.tasks.map((task: ITask) => {
                if (task.ID === updatedTask.ID) {
                  return { ...updatedTask };
                }
                return { ...task };
              }),
            };
          })
          .sort((a: any, b: any) => a.ID - b.ID),
      ];
      state.selectedTask = { ...updatedTask };
    },
    toggleDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
    },
  },
});

export const boardActions = boardSlice.actions;

export default boardSlice.reducer;
