import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import classes from "./task-dialog.module.css";
import { createPortal } from "react-dom";
import { ISubtask, ITask } from "../../../interfaces";
import TaskInfo from "../task-info/task-info";
import TaskEdit from "../task-edit/task-edit";
import { useSelector } from "react-redux";

interface TaskDialogProps {
  editMode: any;
  handleEditMode: any;
}

const TaskDialog = forwardRef(function TaskDialog(
  { editMode, handleEditMode }: TaskDialogProps,
  ref: any
) {
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
        {!editMode && (
          <TaskInfo
            editMode={editMode}
            handleEditMode={handleEditMode}
          ></TaskInfo>
        )}

        {editMode && (
          <TaskEdit
            editMode={editMode}
            handleEditMode={handleEditMode}
          ></TaskEdit>
        )}
      </form>
    </dialog>,

    modal!
  );
});

export default TaskDialog;
