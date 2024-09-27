import { useEffect, useRef, useState } from "react";
import { ITask, ISubtask } from "../../../interfaces";
import classes from "./task-edit.module.css";
import ItemSelect from "../../item-select/item-select";
import SubTaskEdit from "../subtask-edit/subtask-edit";
import { useSelector, useDispatch } from "react-redux";
import { updateTask } from "../../../state/board-action";
import { AppDispatch } from "../../../state/store";
import { boardActions } from "../../../state/boardSlice";
import ConfirmDialog from "../../confirmDialog/confirm-dialog";

interface TaskEditProps {
  title: string;
  task: any;
  handleCloseDialog: any;
  handleDeleteTask: any;
  handleTaskError: any;
  taskError: boolean;
}

const TaskEdit = ({
  title,
  task,
  handleCloseDialog,
  handleDeleteTask,
  handleTaskError,
  taskError,
}: TaskEditProps) => {
  const currentBoard = useSelector(({ boards }: any) => boards.selectedBoard);
  const dispatch = useDispatch<AppDispatch>();
  const deleteDialog = useRef<HTMLDialogElement>();
  const isDarkMode = useSelector(({ boards }: any) => boards?.isDarkMode);

  const [showDeleteDialog, setShowDeleteDialog] = useState(true);
  const [updatedTask, setUpdatedTask] = useState<ITask>(task);

  useEffect(() => {
    setUpdatedTask(task);
  }, [task]);

  const handleDeleteDialog = () => {
    setShowDeleteDialog(true);

    setTimeout(() => {
      if (deleteDialog.current) {
        // @ts-ignore
        deleteDialog.current.open();
      }
    });
  };

  const handleCloseDeleteDialog = () => {
    setShowDeleteDialog(false);
  };

  const handleSetTitle = (e: any) => {
    setUpdatedTask((prev) => {
      return {
        ...prev,
        title: e.target.value,
      };
    });
  };

  const handleSetDescription = (e: any) => {
    setUpdatedTask((prev) => {
      return {
        ...prev,
        description: e.target.value,
      };
    });
  };

  const statusChanged = (e: any) => {
    setUpdatedTask((prev) => {
      return {
        ...prev,
        column_id: e.ID,
        status: e.status,
      };
    });
  };

  const handleUpdateSubTasks = (e: any, updatedSubTask: ISubtask) => {
    setUpdatedTask((prev) => {
      const subtasks = prev.subtasks;

      return {
        ...prev,
        subtasks: subtasks.map((subtask: ISubtask) => {
          if (
            updatedSubTask.tempID &&
            subtask.tempID === updatedSubTask.tempID
          ) {
            return { ...updatedSubTask, title: e };
          }

          if (updatedSubTask.ID && subtask.ID === updatedSubTask.ID) {
            return { ...updatedSubTask, title: e };
          }

          return subtask;
        }),
      };
    });
  };

  const handleDeleteSubTasks = (e: any) => {
    setUpdatedTask((prev) => {
      return {
        ...prev,
        subtasks: prev.subtasks.filter((subtask: ISubtask) => {
          if (e.tempID) {
            return subtask.tempID !== e.tempID;
          }

          return subtask.ID !== e.ID;
        }),
      };
    });
  };

  const handleSave = () => {
    const taskToSave = {
      ...updatedTask,
      subtasks: updatedTask.subtasks.filter((subtask) => subtask.title !== ""),
    }; //filter out empty subtasks

    if (taskToSave.title === "") {
      handleTaskError(true);
      return;
    }
    handleTaskError(false);
    dispatch(updateTask(taskToSave, currentBoard.ID));
    // @ts-ignore
    // dispatch(boardActions.setSelectedTask(null));

    handleCloseDialog(false);
  };

  const handleAddSubTask = () => {
    setUpdatedTask((prev: any) => {
      const tempID =
        prev.subtasks.slice(-1)[0] == null
          ? 1
          : prev.subtasks.slice(-1)[0].ID != null
          ? prev.subtasks.slice(-1)[0].ID + 1
          : prev.subtasks.slice(-1)[0].tempID + 1;
      return {
        ...prev,
        subtasks: [
          ...prev.subtasks,
          {
            tempID,
            title: "",
            isCompleted: false,
          },
        ],
      };
    });
  };

  return (
    // @ts-ignore

    <div className={classes.taskEdit_container}>
      {showDeleteDialog && (
        <ConfirmDialog
          dialogTitle="Delete Task?"
          dialogText={`Are you sure you want to delete the '${task.title}' task and its subtasks? This action cannot be reversed.`}
          handleCloseDialog={handleCloseDeleteDialog}
          handleDelete={handleDeleteTask}
          ref={deleteDialog}
        ></ConfirmDialog>
      )}

      <h1 className={classes.taskEditTitle}>
        {title}
        {taskError && (
          <span className={classes.taskError}>Task title is required</span>
        )}
      </h1>
      <section className={classes.taskEdit_title}>
        <h3>Title</h3>
        <input
          className={`edit_input   ${
            isDarkMode ? "edit_inputDark" : "edit_inputLight"
          }`}
          value={updatedTask?.title as string}
          onChange={handleSetTitle}
          type="text"
        />
      </section>
      <section className={classes.taskEdit_description}>
        <h3>Description</h3>
        <textarea
          className={`edit_input   ${
            isDarkMode ? "edit_inputDark" : "edit_inputLight"
          }`}
          name=""
          id=""
          cols={30}
          rows={10}
          value={updatedTask.description as string}
          onChange={handleSetDescription}
        ></textarea>
      </section>
      <section className={classes.taskEdit_subtasks}>
        <h3>Subtasks</h3>

        {updatedTask.subtasks?.length > 0 &&
          updatedTask.subtasks?.map((sub: ISubtask) => {
            return (
              <div key={sub.tempID || sub.task_id + sub.ID}>
                <SubTaskEdit
                  subtask={sub}
                  handleUpdateSubTasks={handleUpdateSubTasks}
                  handleDeleteSubTasks={handleDeleteSubTasks}
                ></SubTaskEdit>
              </div>
            );
          })}
        <a
          className={`${classes.taskEdit_button} ${classes.subtaskBtn} ${
            isDarkMode
              ? `${classes.subtaskBtnDark}`
              : `${classes.subtaskBtnLight}`
          }`}
          onClick={handleAddSubTask}
        >
          + Add New Task
        </a>
      </section>
      <section className={classes.taskEdi_status}>
        <ItemSelect
          title={"Status"}
          task={updatedTask}
          isEditMode={true}
          statusChanged={statusChanged}
        />
      </section>
      <section className="buttons">
        <a
          className={`${classes.taskEdit_button} ${classes.btnControl}`}
          onClick={handleSave}
        >
          Save Changes
        </a>
        <a
          className={`${classes.taskEdit_button} ${classes.btnControl}`}
          onClick={() => handleCloseDialog()}
        >
          Cancel
        </a>
        {handleDeleteTask && (
          <a
            className={`${classes.taskEdit_button} ${classes.btnControl} ${classes.btnDelete}`}
            onClick={handleDeleteDialog}
          >
            Delete Task
          </a>
        )}
      </section>
    </div>
  );
};

export default TaskEdit;
