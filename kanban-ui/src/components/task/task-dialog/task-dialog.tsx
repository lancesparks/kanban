import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import classes from "./task-dialog.module.css";
import { createPortal } from "react-dom";
import { ISubtask, ITask } from "../../../interfaces";
import TaskInfo from "../task-info/task-info";
import TaskEdit from "../task-edit/task-edit";
import { useDispatch, useSelector } from "react-redux";
import { boardActions } from "../../../state/boardSlice";

interface TaskDialogProps {
  task: any;
  editMode: any;
  handleEditMode: any;
}

const TaskDialog = forwardRef(function TaskDialog(
  { task, editMode, handleEditMode }: TaskDialogProps,
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
        {!editMode && (
          <TaskInfo
            task={selectedTask || currentTask}
            editMode={editMode}
            handleEditMode={handleEditMode}
          ></TaskInfo>
        )}

        {editMode && (
          <TaskEdit
            task={selectedTask || currentTask}
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
