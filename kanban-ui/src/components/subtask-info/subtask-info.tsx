import { useEffect, useRef, useState } from "react";
import classes from "./subtask-info.module.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../state/store";
import { updateTask } from "../../state/board-action";
const SubTaskInfo = ({ task, subtask }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const currentBoard = useSelector(({ boards }: any) => boards.selectedBoard);

  const handleSetSubTaskStatus = (updatedSubtask: any) => {
    const taskToUpdate = {
      ...task,
      subtasks: task.subtasks.map((subtask: any) =>
        subtask.ID === updatedSubtask.ID ? updatedSubtask : subtask
      ),
    };

    dispatch(updateTask(taskToUpdate, currentBoard.ID));
  };

  const isDarkMode = useSelector(({ boards }: any) => boards?.isDarkMode);

  return (
    <section
      className={
        isDarkMode
          ? `${classes.subtask} ${classes.dark}`
          : `${classes.subtask} ${classes.light}`
      }
    >
      <label className={classes.container}>
        <input
          type="checkbox"
          defaultChecked={subtask.isCompleted}
          onChange={() =>
            handleSetSubTaskStatus({
              ...subtask,
              isCompleted: !subtask.isCompleted,
            })
          }
        />
        <span
          className={
            isDarkMode
              ? `${classes.subtask_checkbox} ${classes.dark}`
              : `${classes.subtask_checkbox} ${classes.light}`
          }
        ></span>
      </label>

      <p className={classes.subtask_info}>{subtask.title}</p>
    </section>
  );
};

export default SubTaskInfo;
