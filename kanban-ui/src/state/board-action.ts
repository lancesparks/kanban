import { ITask } from "../interfaces";
import { boardActions } from "./boardSlice";
import { taskActions } from "./taskSlice";
import axios from "axios";

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
      const columns = getColumns(boards);
      dispatch(boardActions.addBoard(boards));
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
      const columnTitles = columns.map((col: any) => col.title);
      dispatch(taskActions.addTasks(columns));
      dispatch(boardActions.addColumn(columnTitles));
    } catch (error) {}
  };
};

const getColumns = (data: any) => {
  return data[0].columns.map((col: any) => col.title);
};
