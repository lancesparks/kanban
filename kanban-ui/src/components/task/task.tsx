import { useEffect, useRef, useState } from "react";
import classes from "./task.module.css";
import TaskDialog from "./task-dialog/task-dialog";
import { ISubtask } from "../../interfaces";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../state/store";
import { boardActions } from "../../state/boardSlice";

const Task = ({ task }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const dialog = useRef<HTMLDialogElement>();
  const [editMode, setEditMode] = useState(false);
  const [currentTask, setCurrentTask] = useState(task);
  const [subtaskStatus, setSubtaskStatus] = useState({
    count: 0,
    completed: 0,
  });

  const handleDialog = (e: any) => {
    if (dialog.current) {
      // @ts-ignore

      dialog.current.open();
      dispatch(boardActions.selectedTask(task));
    }
  };
  const handleEditMode = () => {
    setEditMode((prev) => !prev);
  };

  useEffect(() => {
    handleSetSubtaskStatus();
  }, [task]);

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
      <h3 className={classes.taskTitle}>{currentTask.title}</h3>
      <p className={classes.subtasks}>
        {subtaskStatus.completed} of {subtaskStatus.count} subtasks
      </p>
      <TaskDialog
        ref={dialog}
        editMode={editMode}
        handleEditMode={handleEditMode}
      ></TaskDialog>
    </section>
  );
};

export default Task;
