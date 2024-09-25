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
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../state/store";
import { deleteTask } from "../../../state/board-action";

interface TaskDialogProps {
  defaultTask: any;
  editMode: any;
  handleCloseDialog: any;
  addTask: boolean;
}

const TaskDialog = forwardRef(function TaskDialog(
  { defaultTask, editMode, handleCloseDialog, addTask }: TaskDialogProps,
  ref: any
) {
  const dialog = useRef<HTMLDialogElement>();
  const modal = document.getElementById("root");
  const isDarkMode = useSelector(({ boards }: any) => boards?.isDarkMode);
  const dispatch = useDispatch<AppDispatch>();
  const selectedTask = useSelector(({ boards }: any) => boards?.selectedTask);
  const selectedBoard = useSelector(({ boards }: any) => boards?.selectedBoard);
  const [currentTask, setCurrentTask] = useState(selectedTask);
  const [taskError, setTaskError] = useState(false);

  useImperativeHandle(ref, () => {
    return {
      open() {
        handleTaskError(false);
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

  const handleDeleteTask = () => {
    dispatch(deleteTask(currentTask, selectedBoard.ID));
  };

  const handleTaskError = (err: boolean) => {
    setTaskError(err);
  };

  const getClasses = () => {
    if (isDarkMode) {
      return `modal ${classes.modalContainer} ${classes.modalContainerDark}`;
    } else {
      return `modal ${classes.modalContainer} ${classes.modalContainerLight}`;
    }
  };

  return createPortal(
    // @ts-ignore
    <dialog ref={dialog} className={getClasses()}>
      <form className={classes.taskForm} method="dialog">
        {!editMode && !addTask && (
          <TaskInfo
            task={selectedTask}
            handleEditMode={handleCloseDialog}
            handleDeleteTask={handleDeleteTask}
          ></TaskInfo>
        )}
        {editMode && !addTask && selectedTask && (
          <TaskEdit
            title="Edit Task"
            task={selectedTask}
            handleCloseDialog={handleCloseDialog}
            handleDeleteTask={handleDeleteTask}
            handleTaskError={handleTaskError}
            taskError={taskError}
          ></TaskEdit>
        )}
        {!editMode && addTask && defaultTask && (
          <TaskEdit
            title="Add Task"
            task={defaultTask}
            handleCloseDialog={handleCloseDialog}
            handleDeleteTask={null}
            handleTaskError={handleTaskError}
            taskError={taskError}
          ></TaskEdit>
        )}
      </form>
    </dialog>,

    modal!
  );
});

export default TaskDialog;
