import React, {
  forwardRef,
  MutableRefObject,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import classes from "./item-select.module.css";
import { createPortal } from "react-dom";
import { ITask } from "../../interfaces";
import SubTaskInfo from "../subtask-info/subtask-info";
import chevronDown from "../../assets/icon-chevron-down.svg";
import ellipsis from "../../assets/icon-vertical-ellipsis.svg";

interface ItemSelectProps {
  title: string;
  taskStatuses: any;
}

const ItemSelect = ({ title, taskStatuses }: ItemSelectProps) => {
  return (
    // @ts-ignore
    <>
      <p className={classes.status_container_header}>{title}</p>
      <span className={classes.select_container}>
        <select className={classes.status_select}>
          {taskStatuses.map((status: string, index: number) => (
            <option key={index} value={status}>
              {status}
            </option>
          ))}
        </select>
        <img src={chevronDown} alt="" className={classes.chevron} />
      </span>
    </>
  );
};

export default ItemSelect;
