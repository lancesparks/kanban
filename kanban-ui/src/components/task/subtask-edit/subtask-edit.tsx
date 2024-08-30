import { useEffect, useState } from "react";
import { ITask, ISubtask } from "../../../interfaces";
import classes from "./subtask-edit.module.css";
import ItemSelect from "../../item-select/item-select";
import cross from "../../../assets/icon-cross.svg";
import axios from "axios";

interface SubTaskEditProps {
  ID: number;
  title: string;
  updateSubTask: any;
  handleDeleteSubTasks: any;
}

const SubTaskEdit = ({
  ID,
  title,
  updateSubTask,
  handleDeleteSubTasks,
}: SubTaskEditProps) => {
  return (
    <section className={classes.taskEdit_subtaskContainer}>
      <input
        className={`${classes.taskEdit_input} ${classes.subtaskInput}`}
        type="text"
        value={title}
        onChange={(e) => updateSubTask(e.target.value, ID)}
      />
      <img
        src={cross}
        className={classes.cross}
        alt=""
        onClick={() => handleDeleteSubTasks(ID)}
      />
    </section>
  );
};

export default SubTaskEdit;
