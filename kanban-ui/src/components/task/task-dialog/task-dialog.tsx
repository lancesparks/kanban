import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import classes from "./task-dialog.module.css";
import { createPortal } from "react-dom";
import TaskInfo from "../task-info/task-info";
import TaskEdit from "../task-edit/task-edit";
import { useSelector } from "react-redux";

interface TaskDialogProps {
  task: any;
  editMode: any;
  handleCloseDialog: any;
  addTask: boolean;
}

const TaskDialog = forwardRef(function TaskDialog(
  { task, editMode, handleCloseDialog, addTask }: TaskDialogProps,
  ref: any
) {
  const dialog = useRef<HTMLDialogElement>();
  const modal = document.getElementById("root");
  const [currentTask, setCurrentTask] = useState(task);
  const selectedTask = useSelector(({ boards }: any) => boards?.selectedTask);

  useImperativeHandle(ref, () => {
    return {
      open() {
        dialog.current?.showModal();
      },
    };
  });

  useEffect(() => {
    setCurrentTask((prev: any) => {
      if (!selectedTask) {
        return { ...prev };
      }

      return { ...selectedTask };
    });
  }, [selectedTask]);

  return createPortal(
    // @ts-ignore
    <dialog ref={dialog} className={`modal ${classes.modalContainer}`}>
      <form className={classes.taskForm} method="dialog">
        {!editMode && !addTask && (
          <TaskInfo
            task={selectedTask || currentTask}
            handleEditMode={handleCloseDialog}
          ></TaskInfo>
        )}
        {editMode && !addTask && (
          <TaskEdit
            title="Edit Task"
            task={selectedTask || currentTask}
            handleCloseDialog={handleCloseDialog}
          ></TaskEdit>
        )}
        {!editMode && addTask && selectedTask && (
          <TaskEdit
            title="Add Task"
            task={selectedTask}
            handleCloseDialog={handleCloseDialog}
          ></TaskEdit>
        )}
      </form>
    </dialog>,

    modal!
  );
});

export default TaskDialog;
