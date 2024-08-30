import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import classes from "./task-dialog.module.css";
import { createPortal } from "react-dom";
import { ISubtask, ITask } from "../../../interfaces";
import TaskInfo from "../task-info/task-info";
import TaskEdit from "../task-edit/task-edit";

interface TaskDialogProps {
  task: ITask;
  subtaskStatus: any;
  currentSubTasks: ISubtask[];
  setCurrentSubTasks: any;
  editMode: boolean;
  handleEditMode: any;
  handleSave: any;
  handleDeleteSubTasks: any;
  handleSetSubTaskStatus: any;
}

const TaskDialog = forwardRef(function TaskDialog(
  {
    task,
    subtaskStatus,
    currentSubTasks,
    setCurrentSubTasks,
    editMode,
    handleEditMode,
    handleSave,
    handleDeleteSubTasks,
    handleSetSubTaskStatus,
  }: TaskDialogProps,
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
            task={task}
            subtaskStatus={subtaskStatus}
            handleEditMode={handleEditMode}
            handleSetSubTaskStatus={handleSetSubTaskStatus}
          ></TaskInfo>
        )}

        {editMode && (
          <TaskEdit
            task={task}
            currentSubTasks={currentSubTasks}
            setCurrentSubTasks={setCurrentSubTasks}
            handleEditMode={handleEditMode}
            handleSave={handleSave}
            handleDeleteSubTasks={handleDeleteSubTasks}
            handleSetSubTaskStatus={handleSetSubTaskStatus}
          ></TaskEdit>
        )}
      </form>
    </dialog>,

    modal!
  );
});

export default TaskDialog;
