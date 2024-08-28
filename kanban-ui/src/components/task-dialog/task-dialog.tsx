import React, {
  forwardRef,
  MutableRefObject,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import classes from "./task-dialog.module.css";
import { createPortal } from "react-dom";
import { ITask } from "../../interfaces";
import SubTaskInfo from "../subtask-info/subtask-info";
import chevronDown from "../../assets/icon-chevron-down.svg";
import ellipsis from "../../assets/icon-vertical-ellipsis.svg";
import TaskInfo from "../task-info/task-info";
import TaskEdit from "../task-edit/task-edit";

interface TaskDialogProps {
  task: ITask;
  subtaskStatus: any;
  handleSetSubTaskStatus: any;
}

const TaskDialog = forwardRef(function TaskDialog(
  { task, subtaskStatus, handleSetSubTaskStatus }: TaskDialogProps,
  ref: any
) {
  const [editTask, setEditTask] = useState(false);

  const dialog = useRef<HTMLDialogElement>();
  const modal = document.getElementById("root");

  useImperativeHandle(ref, () => {
    return {
      open() {
        dialog.current?.showModal();
      },
    };
  });

  return createPortal(
    // @ts-ignore
    <dialog ref={dialog} className={`modal ${classes.modalContainer}`}>
      <form className={classes.taskForm} method="dialog">
        {!editTask && (
          <TaskInfo
            task={task}
            editTask={editTask}
            setEditTask={setEditTask}
            subtaskStatus={subtaskStatus}
            handleSetSubTaskStatus={handleSetSubTaskStatus}
          ></TaskInfo>
        )}

        {editTask && (
          <TaskEdit
            task={task}
            editTask={editTask}
            setEditTask={setEditTask}
            subtaskStatus={subtaskStatus}
          ></TaskEdit>
        )}
      </form>
    </dialog>,

    modal!
  );
});

export default TaskDialog;
