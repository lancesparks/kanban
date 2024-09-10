import { ITask } from "../interfaces";
import { taskActions } from "./taskSlice";
import axios from "axios";

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
      dispatch(taskActions.addTasks(tasks));
    } catch (error) {
      console.log(error);
    }
  };
};

export const updateTask = (updatedTask: ITask) => {
  return async (dispatch: any) => {
    const fetchData = async () => {
      const response = await axios.post(
        `http://127.0.0.1:8080/boards/tasks/${updatedTask.ID}`,
        updatedTask
      );
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Could not fetch data!");
      }

      return response.data.task;
    };

    try {
      const updatedTask = await fetchData();
      dispatch(taskActions.updateTask(updatedTask));
    } catch (error) {
      console.log(error);
    }
  };
};

//   axios
//     .post(`http://127.0.0.1:8080/boards/tasks/${ID}`, updatedTask)
//     .then((response: any) => {
//       if (response.statusText.toLowerCase() === "created") {
//         setCurrentTask((prev: any) => {
//           return { ...response.data.task };
//         });
//         setCurrentSubTasks(response.data.task.subtasks);
//         setSubtaskCount(response.data.task.subtasks);
//         handleEditMode();
//       }
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// }
