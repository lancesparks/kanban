import { useState } from "react";
import { ITask, ISubtask } from "../../../interfaces";
import classes from "./task-edit.module.css";
import ItemSelect from "../../item-select/item-select";
import SubTaskEdit from "../subtask-edit/subtask-edit";
import { useSelector, useDispatch } from "react-redux";
import { updateTask } from "../../../state/task-action";
import { AppDispatch } from "../../../state/store";
interface TaskEditProps {
  editMode: any;
  handleEditMode: any;
}

const TaskEdit = ({ editMode, handleEditMode }: TaskEditProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const task = useSelector(({ tasks }: any) => tasks.selectedTask);
  const [updatedTask, setUpdatedTask] = useState<ITask>(task);

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
        status: e,
      };
    });
  };

  const handleUpdateSubTasks = (e: any, subtaskId: number) => {
    setUpdatedTask((prev) => {
      return {
        ...prev,
        subtasks: prev.subtasks.map((subtask: ISubtask) => {
          if (subtask.ID === subtaskId) {
            return {
              ...subtask,
              title: e,
            };
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
        subtasks: prev.subtasks.filter((subtask: ISubtask) => subtask.ID !== e),
      };
    });
  };

  const handleSave = () => {
    const taskToSave = {
      ...updatedTask,
      subtasks: updatedTask.subtasks.filter((subtask) => subtask.title !== ""),
    }; //filter out empty subtasks
    dispatch(updateTask(taskToSave));
    handleEditMode(false);
  };

  const handleAddSubTask = () => {
    setUpdatedTask((prev: any) => {
      return {
        ...prev,
        subtasks: [
          ...prev.subtasks,
          {
            ID: prev.subtasks.length + 10,
            title: "",
            isCompleted: false,
            taskId: prev.ID,
          },
        ],
      };
    });
  };

  return (
    // @ts-ignore
    <div className={classes.taskEdit_container}>
      <h1>Edit Task</h1>
      <section className={classes.taskEdit_title}>
        <h3>Title</h3>
        <input
          className={classes.taskEdit_input}
          value={updatedTask.title as string}
          onChange={handleSetTitle}
          type="text"
        />
      </section>
      <section className={classes.taskEdit_description}>
        <h3>Description</h3>
        <textarea
          className={classes.taskEdit_input}
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
          updatedTask.subtasks?.map((subtask: ISubtask) => {
            return (
              <SubTaskEdit
                key={subtask.ID}
                ID={subtask.ID}
                taskID={subtask.taskId}
                title={subtask.title}
                isCompleted={subtask.isCompleted}
                handleUpdateSubTasks={handleUpdateSubTasks}
                handleDeleteSubTasks={handleDeleteSubTasks}
              ></SubTaskEdit>
            );
          })}
        <a
          className={`${classes.taskEdit_button} ${classes.subtaskBtn}`}
          onClick={handleAddSubTask}
        >
          + Add New Task
        </a>
      </section>
      <section className={classes.taskEdi_status}>
        <ItemSelect
          title={"Status"}
          task={task}
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
          onClick={() => handleEditMode()}
        >
          Cancel
        </a>
      </section>
    </div>
  );
};

export default TaskEdit;
