import { useEffect, useRef, useState } from "react";
import classes from "./subtask-info.module.css";
import axios from "axios";

const SubTaskInfo = ({ taskId, handleSetSubTaskStatus, subtask }: any) => {
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
