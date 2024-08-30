import { useState } from "react";
import { ITask, ISubtask } from "../../../interfaces";
import classes from "./task-edit.module.css";
import cross from "../../../assets/icon-cross.svg";
import axios from "axios";
import ItemSelect from "../../item-select/item-select";
import SubTaskEdit from "../subtask-edit/subtask-edit";

interface TaskEditProps {
  task: ITask;
  currentSubTasks: ISubtask[];
  setCurrentSubTasks: any;
  handleEditMode: any;
  handleSave: any;
  handleDeleteSubTasks: any;
  handleSetSubTaskStatus: any;
}

const TaskEdit = ({
  task,
  currentSubTasks,
  setCurrentSubTasks,
  handleEditMode,
  handleSave,
  handleDeleteSubTasks,
}: TaskEditProps) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  const AddSubTask = () => {
    setCurrentSubTasks((prev: any) => {
      return [...prev, { title: "", taskId: task.ID, isCompleted: false }];
    });
  };

  const updateSubTasks = (value: string, subtaskId: number) => {
    setCurrentSubTasks((prev: any) => {
      return prev.map((subtask: any) => {
        if (subtask.ID === subtaskId) {
          return {
            ...subtask,
            title: value,
          };
        }
        return subtask;
      });
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
          value={title as string}
          onChange={(e) => setTitle(e.target.value)}
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
          value={description as string}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </section>
      <section className={classes.taskEdit_subtasks}>
        <h3>Subtasks</h3>
        {currentSubTasks?.length > 0 &&
          currentSubTasks?.map((subtask: ISubtask) => {
            return (
              <SubTaskEdit
                key={subtask.ID}
                {...subtask}
                updateSubTask={updateSubTasks}
                handleDeleteSubTasks={handleDeleteSubTasks}
              ></SubTaskEdit>
            );
          })}
        <a
          className={`${classes.taskEdit_button} ${classes.subtaskBtn}`}
          onClick={() => AddSubTask()}
        >
          + Add New Task
        </a>
      </section>
      <section className={classes.taskEdi_status}>
        <h3>Status</h3>
        <ItemSelect title="" taskStatuses={["To Do", "In Progress", "Done"]} />
      </section>
      <section className="buttons">
        <a
          className={`${classes.taskEdit_button} ${classes.btnControl}`}
          onClick={() =>
            handleSave(task.ID, title, description, currentSubTasks)
          }
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
