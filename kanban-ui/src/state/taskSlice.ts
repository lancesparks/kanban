import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { ISubtask, ITask } from "../interfaces";
import axios from "axios";

export interface TaskState {
  tasks: ITask[];
  selectedTask: ITask | null;
  statuses: string[];
}

const taskAdapter = createEntityAdapter();

const initialState: TaskState = taskAdapter.getInitialState({
  tasks: [],
  selectedTask: null,
  statuses: [],
});

export const updateSubTask = createAsyncThunk(
  "tasks/fetchSubTasks",
  async (subtask: ISubtask) => {
    const response = await axios.patch(
      `http://127.0.0.1:8080/boards/tasks/subtask`,
      subtask
    );
    return response.data;
  }
);

export const taskSlice = createSlice({
  name: "task",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setStatuses: (state, action: PayloadAction<string[]>) => {
      state.statuses = action.payload;
    },
    selectedTask: (state, action: PayloadAction<ITask>) => {
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
    updateTask: (state, action: PayloadAction<any>) => {
      let updatedTask = { ...action.payload };

      state.tasks = [
        ...state.tasks.filter((task) => task.ID !== updatedTask.ID),
        updatedTask,
      ];
      state.selectedTask = { ...updatedTask };
    },
    updateSubtasks: (state, action: PayloadAction<ISubtask[]>) => {
      let subtasks = action.payload;
      let updatedTask = { ...state.tasks[0], subtasks: subtasks };
      state.tasks = [...state.tasks, updatedTask];
      state.selectedTask = { ...updatedTask };
    },
  },

  // extraReducers: (builder) => {
  //   builder.addCase(fetchAllTasks.fulfilled, (state, action) => {
  //     state.tasks = [...action.payload.tasks];
  //   });
  //   builder.addCase(updateSubTask.fulfilled, (state, action) => {
  //     const tasks = taskAdapter.getSelectors((state: any) => state.tasks);
  //     console.log(tasks);
  //     // const updatedSubTask = action.payload.subtasks[0];
  //     // const updatedTasks = state.tasks.map((task) => {
  //     //   if (task.ID === updatedSubTask.taskId) {
  //     //     return {
  //     //       ...task,
  //     //       subtasks: task.subtasks.map((subtask) => {
  //     //         if (subtask.ID === updatedSubTask.ID) {
  //     //           return updatedSubTask;
  //     //         } else {
  //     //           return subtask;
  //     //         }
  //     //       }),
  //     //     };
  //     //   } else {
  //     //     return task;
  //     //   }
  //     // });
  //     // state.tasks = [...updatedTasks];
  //   });
  // },
});

export const taskActions = taskSlice.actions;

export default taskSlice.reducer;
