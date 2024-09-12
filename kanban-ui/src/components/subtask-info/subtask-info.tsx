import { useEffect, useRef, useState } from "react";
import classes from "./subtask-info.module.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../state/store";
import { updateSubTask } from "../../state/board-action";
const SubTaskInfo = ({ task_id, subtask }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const handleSetSubTaskStatus = (subtask: any) => {
    dispatch(updateSubTask(subtask));
  };

  return (
    <section className={classes.subtask}>
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
        <span className={classes.subtask_checkbox}></span>
      </label>

      <p className={classes.subtask_info}>{subtask.title}</p>
    </section>
  );
};

export default SubTaskInfo;
