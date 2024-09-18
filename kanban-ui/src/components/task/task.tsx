import { useEffect, useRef, useState } from "react";
import classes from "./task.module.css";
import TaskDialog from "./task-dialog/task-dialog";
import { ISubtask } from "../../interfaces";

const Task = ({ task }: any) => {
  const dialog = useRef<HTMLDialogElement>();
  const [editMode, setEditMode] = useState(false);
  const [subtaskStatus, setSubtaskStatus] = useState({
    count: 0,
    completed: 0,
  });

  const handleDialog = (e: any) => {
    if (dialog.current) {
      // @ts-ignore
      dialog.current.open();
    }
  };

  const handleEditMode = () => {
    setEditMode((prev) => !prev);
  };

  useEffect(() => {
    handleSetSubtaskStatus();
  }, [task]);

  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.code === "Escape") {
        setEditMode(false);
      }
    }

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, []);

  const handleSetSubtaskStatus = () => {
    setSubtaskStatus((prev: any) => {
      return {
        count: task.subtasks.length,
        completed:
          task.subtasks.length > 0
            ? task.subtasks.filter((subtask: ISubtask) => subtask.isCompleted)
                .length
            : 0,
      };
    });
  };

  return (
    <section className={classes.taskContainer} onClick={handleDialog}>
      <h3 className={classes.taskTitle}>{task.title}</h3>
      <p className={classes.subtasks}>
        {subtaskStatus.completed} of {subtaskStatus.count} subtasks
      </p>
      <TaskDialog
        task={task}
        ref={dialog}
        editMode={editMode}
        handleCloseDialog={handleEditMode}
        addTask={false}
      ></TaskDialog>
    </section>
  );
};

export default Task;
