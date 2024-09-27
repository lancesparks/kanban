import { useEffect, useState } from "react";
import { ISubtask } from "../../../interfaces";
import classes from "./subtask-edit.module.css";
import ItemSelect from "../../item-select/item-select";
import cross from "../../../assets/icon-cross.svg";
import axios from "axios";
import { useSelector } from "react-redux";

interface SubTaskEditProps {
  subtask: ISubtask;
  handleUpdateSubTasks: any;
  handleDeleteSubTasks: any;
}

const SubTaskEdit = ({
  subtask,
  handleUpdateSubTasks,
  handleDeleteSubTasks,
}: SubTaskEditProps) => {
  const isDarkMode = useSelector(({ boards }: any) => boards?.isDarkMode);

  return (
    <section
      className={
        isDarkMode
          ? `${classes.taskEdit_subtaskContainer} ${classes.dark}`
          : `${classes.taskEdit_subtaskContainer} ${classes.light}`
      }
    >
      <input
        className={`edit_input ${classes.subtaskInput}`}
        type="text"
        value={subtask.title}
        onChange={(e) => handleUpdateSubTasks(e.target.value, subtask)}
      />
      <img
        src={cross}
        className={classes.cross}
        alt=""
        onClick={() => handleDeleteSubTasks(subtask)}
      />
    </section>
  );
};

export default SubTaskEdit;
