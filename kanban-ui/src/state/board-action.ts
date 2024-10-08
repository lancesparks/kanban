import { ISubtask, ITask } from "../interfaces";
import { boardActions } from "./boardSlice";

import axios from "axios";

export const createBoard = (board: any) => {
  return async (dispatch: any) => {
    const fetchData = async () => {
      const response = await axios.post(`http://127.0.0.1:8080/boards`, board);

      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Could not fetch data!");
      }
      return response.data.board;
    };

    try {
      const board = await fetchData();
      dispatch(boardActions.addCreatedBoard(board));
    } catch (error) {
      console.log(error);
    }
  };
};

export const deleteBoard = (boardID: number) => {
  return async (dispatch: any) => {
    const fetchData = async () => {
      const response = await axios.delete(
        `http://127.0.0.1:8080/boards/${boardID}`
      );
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Could not fetch data!");
      }

      return response.data.boards;
    };

    try {
      const boards = await fetchData();
      if (boards) {
        dispatch(boardActions.addBoard(boards));
        dispatch(boardActions.setSelectedBoard(boards[0]));
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const getAllBoards = () => {
  return async (dispatch: any) => {
    const fetchData = async () => {
      const response = await axios.get(`http://127.0.0.1:8080/boards`);

      if (response.status !== 200) {
        throw new Error("Could not fetch data!");
      }
      return response.data.boards;
    };

    try {
      const boards = await fetchData();
      dispatch(boardActions.addBoard(boards));
      dispatch(boardActions.setSelectedBoard(boards[0]));
    } catch (error) {
      console.log(error);
    }
  };
};

export const getBoardColumns = (boardId: number) => {
  return async (dispatch: any) => {
    const fetchData = async () => {
      const response = await axios.get(
        `http://127.0.0.1:8080/columns/${boardId}`
      );

      if (response.status !== 200) {
        throw new Error("Could not fetch data!");
      }
      return response.data.columns;
    };

    try {
      const columns = await fetchData();
      const columnTitles = columns.map((col: any) => {
        return {
          ID: col.ID,
          status: col.title.toUpperCase(),
        };
      });

      const tasks = [...columns.map((tasks: any) => [...tasks.tasks])].flat();
      dispatch(boardActions.addTasks(tasks));
      dispatch(boardActions.addColumns(columns));
      dispatch(boardActions.addBoardStatuses(columnTitles));
    } catch (error) {}
  };
};

export const updateBoard = (board: ITask) => {
  return async (dispatch: any) => {
    const fetchData = async () => {
      const response = await axios.post(`http://127.0.0.1:8080/boards/update`, {
        board,
      });
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Could not fetch data!");
      }

      return response.data;
    };

    try {
      const data = await fetchData();
      dispatch(boardActions.updateBoard(data));
    } catch (error) {
      console.log(error);
    }
  };
};

const getColumns = (data: any) => {
  return data[0].columns.map((col: any) => col.title);
};

export const getAllTasks = (selectedBoardID: number) => {
  return async (dispatch: any) => {
    const fetchData = async () => {
      const response = await axios.get(
        `http://127.0.0.1:8080/boards/tasks/${selectedBoardID}`
      );

      if (response.status !== 200) {
        throw new Error("Could not fetch data!");
      }

      return response.data.tasks;
    };

    try {
      const tasks = await fetchData();
      dispatch(boardActions.addTasks(tasks));
    } catch (error) {
      console.log(error);
    }
  };
};

export const updateTask = (updatedTask: ITask, boardID: number) => {
  return async (dispatch: any) => {
    const fetchData = async () => {
      const response = await axios.post(
        `http://127.0.0.1:8080/boards/tasks/${updatedTask.ID}`,
        { updatedTask, boardID }
      );
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Could not fetch data!");
      }

      return response.data;
    };

    try {
      const updated = await fetchData();
      dispatch(boardActions.updateTasks(updated));
    } catch (error) {
      console.log(error);
    }
  };
};

export const deleteTask = (task: ITask, boardID: number) => {
  return async (dispatch: any) => {
    const fetchData = async () => {
      const response = await axios.delete(
        `http://127.0.0.1:8080/boards/tasks/${task.ID}`
      );
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Could not fetch data!");
      }

      return response.status === 201 ? true : false;
    };

    try {
      const deleted = await fetchData();
      if (deleted) {
        dispatch(getBoardColumns(boardID));
      }
    } catch (error) {
      console.log(error);
    }
  };
};
