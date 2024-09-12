import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ISubtask, ITask, IColumnStatus } from "../interfaces";
export interface BoardState {
  boards: any[];
  boardStatuses: IColumnStatus[];
  columns: any[];
  tasks: ITask[];
  selectedTask: ITask | null;
  statuses: string[];
}

const initialState: BoardState = {
  boards: [],
  boardStatuses: [],
  columns: [],
  tasks: [],
  selectedTask: null,
  statuses: [],
};

export const boardSlice = createSlice({
  name: "board",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    updateColumn: (state, action: PayloadAction<any[]>) => {
      state.columns = action.payload;
    },
    addColumns: (state, action: PayloadAction<any[]>) => {
      state.columns = action.payload;
    },
    addBoardStatuses: (state, action: PayloadAction<any[]>) => {
      state.boardStatuses = action.payload;
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
      let updatedTask = { ...action.payload };

      state.columns = state.columns.map((col) => {
        if (col.ID === updatedTask.column_id) {
          return {
            ...col,
            tasks: col.tasks.map((task: any) => {
              if (task.ID === updatedTask.ID) {
                return { ...task };
              }
              return task;
            }),
          };
        }
        return col;
      });

      state.selectedTask = { ...updatedTask };
    },
    updateSubtasks: (state, action: PayloadAction<ISubtask[]>) => {
      let subtasks = action.payload;

      let currentTask: any = state.tasks.filter(
        (task) => task.ID == subtasks[0].task_id
      )[0];

      currentTask = { ...currentTask, subtasks: subtasks };

      state.columns = state.columns.map((col) => {
        // console.log(JSON.stringify(currentTask, null, 2));

        if (col.ID === currentTask.column_id) {
          return {
            ...col,
            tasks: col.tasks.map((task: any) => {
              if (task.ID === currentTask.ID) {
                return { ...task, subtasks: subtasks };
              }
              return task;
            }),
          };
        }
        return col;
      });
      state.selectedTask = { ...currentTask };
    },
  },
});

export const boardActions = boardSlice.actions;

export default boardSlice.reducer;
