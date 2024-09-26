import { useEffect, useState } from "react";
import { ITask, ISubtask } from "../../../interfaces";
import classes from "./subtask-edit.module.css";
import ItemSelect from "../../item-select/item-select";
import cross from "../../../assets/icon-cross.svg";
import axios from "axios";
import { useSelector } from "react-redux";

interface SubTaskEditProps {
  ID: number;
  task_id: number;
  title: string;
  isCompleted: boolean;
  handleUpdateSubTasks: any;
  handleDeleteSubTasks: any;
}

const SubTaskEdit = ({
  ID,
  title,
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
        value={title}
        onChange={(e) => handleUpdateSubTasks(e.target.value, ID)}
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
