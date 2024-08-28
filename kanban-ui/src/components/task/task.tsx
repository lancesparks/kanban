import React, { useEffect, useRef, useState } from "react";
import boardIcon from "../../assets/icon-board.svg";
import classes from "./task.module.css";
import TaskEdit from "../task-edit/task-edit";
import TaskInfo from "../task-info/task-info";
import TaskDialog from "../task-dialog/task-dialog";
import { ISubtask, ITask } from "../../interfaces";
import axios from "axios";

const Task = ({ task }: any) => {
  const dialog = useRef<HTMLDialogElement>();
  const [currentTask, setCurrentTask] = useState(task);
  const [subtaskStatus, setSubtaskStatus] = React.useState({
    count: 0,
    completed: 0,
  });

  useEffect(() => {
    if (!task.subtasks) {
      return;
    }
    setSubtaskCount(task.subtasks);
  }, []);

  const handleSetSubTaskStatus = (subtask: ISubtask) => {
    axios
      .patch(`http://127.0.0.1:8080/boards/tasks/subtask`, {
        id: subtask.ID,
        taskID: subtask.taskId,
        isCompleted: subtask.isCompleted,
      })
      .then((response: any) => {
        setSubtaskCount(response.data.subtasks);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDialog = (e: any) => {
    if (dialog.current) {
      // @ts-ignore
      dialog.current.open();
    }
  };

  const setSubtaskCount = (subtasks: ISubtask[]) => {
    const count = subtasks.length;
    const completed = subtasks.filter(
      (subtask: any) => subtask.isCompleted
    ).length;
    setSubtaskStatus({ count, completed });
    setCurrentTask({ ...currentTask, subtasks });
  };

  return (
    <section className={classes.taskContainer} onClick={handleDialog}>
      <h3 className={classes.taskTitle}>{task.title}</h3>
      <p className={classes.subtasks}>
        {subtaskStatus.completed} of {subtaskStatus.count} subtasks
      </p>
      <TaskDialog
        ref={dialog}
        task={currentTask}
        subtaskStatus={subtaskStatus}
        handleSetSubTaskStatus={handleSetSubTaskStatus}
      ></TaskDialog>
    </section>
  );
};

export default Task;
