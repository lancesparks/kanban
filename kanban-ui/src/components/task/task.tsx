import React, { useEffect, useRef, useState } from "react";
import classes from "./task.module.css";
import TaskDialog from "./task-dialog/task-dialog";
import { ISubtask, ITask } from "../../interfaces";
import axios from "axios";

const Task = ({ task }: any) => {
  const dialog = useRef<HTMLDialogElement>();
  const [editMode, setEditMode] = useState(false);
  const [currentTask, setCurrentTask] = useState(task);
  const [currentSubTasks, setCurrentSubTasks] = useState(task.subtasks);
  const [subtaskStatus, setSubtaskStatus] = React.useState({
    count: 0,
    completed: 0,
  });

  const handleDialog = (e: any) => {
    if (dialog.current) {
      // @ts-ignore
      dialog.current.open();
    }
  };

  useEffect(() => {
    setSubtaskCount(currentSubTasks);
  }, [currentSubTasks]);

  const handleEditMode = () => {
    setEditMode((prev) => !prev);
  };
  const setSubtaskCount = (subtasks: ISubtask[]) => {
    if (subtasks?.length === 0) {
      setSubtaskStatus({ count: 0, completed: 0 });
      return;
    }

    const count = subtasks.length;
    const completed = subtasks.filter(
      (subtask: any) => subtask.isCompleted
    ).length;
    setSubtaskStatus((prev) => {
      return {
        count,
        completed,
      };
    });
  };

  const handleSave = (
    ID: number,
    title: string,
    description: string,
    subtasks: ISubtask[]
  ) => {
    let updatedTask: ITask = {
      ...task,
      title,
      description,
      subtasks,
    };
    axios
      .post(`http://127.0.0.1:8080/boards/tasks/${ID}`, updatedTask)
      .then((response: any) => {
        if (response.statusText.toLowerCase() === "created") {
          setCurrentTask((prev: any) => {
            return { ...response.data.task };
          });
          setCurrentSubTasks(response.data.task.subtasks);
          setSubtaskCount(response.data.task.subtasks);
          handleEditMode();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeleteSubTasks = (subtaskId: number) => {
    if (!subtaskId) {
      setCurrentSubTasks((prev: ISubtask[]) => {
        return prev.filter((subtask: Partial<ISubtask>) => {
          return subtask.hasOwnProperty("ID");
        });
      });
      return;
    }
    const subTaskToDelete: ISubtask | undefined = currentSubTasks.find(
      (subtask: any) => subtask.ID === subtaskId
    );
    if (subTaskToDelete) {
      axios
        .delete(`http://127.0.0.1:8080/boards/tasks/subtask/`, {
          data: subTaskToDelete,
        })
        .then((response: any) => {
          const updatedTask = { ...task, subtasks: response.data.subtasks };
          setCurrentTask(updatedTask);
          setCurrentSubTasks(response.data.subtasks);
          setSubtaskCount(response.data.subtasks);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleSetSubTaskStatus = (subtask: ISubtask) => {
    axios
      .patch(`http://127.0.0.1:8080/boards/tasks/subtask`, {
        id: subtask.ID,
        taskID: subtask.taskId,
        isCompleted: subtask.isCompleted,
        title: subtask.title,
      })
      .then((response: any) => {
        setSubtaskCount(response.data.subtasks);
        setCurrentTask({ ...currentTask, subtasks: response.data.subtasks });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <section className={classes.taskContainer} onClick={handleDialog}>
      <h3 className={classes.taskTitle}>{currentTask.title}</h3>
      <p className={classes.subtasks}>
        {subtaskStatus.completed} of {subtaskStatus.count} subtasks
      </p>
      <TaskDialog
        ref={dialog}
        task={currentTask}
        subtaskStatus={subtaskStatus}
        currentSubTasks={currentSubTasks}
        setCurrentSubTasks={setCurrentSubTasks}
        editMode={editMode}
        handleEditMode={handleEditMode}
        handleSave={handleSave}
        handleDeleteSubTasks={handleDeleteSubTasks}
        handleSetSubTaskStatus={handleSetSubTaskStatus}
      ></TaskDialog>
    </section>
  );
};

export default Task;
