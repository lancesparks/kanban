import { useState } from "react";
import { ITask } from "../../interfaces";
import classes from "./task-edit.module.css";
import ItemSelect from "../item-select/item-select";
import cross from "../../assets/icon-cross.svg";

interface TaskEditProps {
  task: ITask;
  subtaskStatus: {
    count: number;
    completed: number;
  };
  editTask: boolean;
  setEditTask: any;
}

const TaskEdit = (
  { task, subtaskStatus, editTask, setEditTask }: TaskEditProps,
  ref: any
) => {
  const [subtasks, setSubTasks] = useState(task.subtasks);

  return (
    // @ts-ignore
    <div className={classes.taskEdit_container}>
      <h1>Edit Task</h1>
      <section className={classes.taskEdit_title}>
        <h3>Title</h3>
        <input className={classes.taskEdit_input} type="text" />
      </section>
      <section className={classes.taskEdit_description}>
        <h3>Description</h3>
        <textarea
          className={classes.taskEdit_input}
          name=""
          id=""
          cols={30}
          rows={10}
        ></textarea>
      </section>
      <section className={classes.taskEdit_subtasks}>
        <h3>Subtasks</h3>
        {subtasks.map((subtask: any, index: any) => {
          return (
            <section key={index} className={classes.taskEdit_subtaskContainer}>
              <input
                className={`${classes.taskEdit_input} ${classes.subtaskInput}`}
                type="text"
              />
              <img src={cross} className={classes.cross} alt="" />
            </section>
          );
        })}
        <button className={`${classes.taskEdit_button} ${classes.subtaskBtn}`}>
          + Add New Task
        </button>
      </section>
      <section className={classes.taskEdi_status}>
        <h3>Status</h3>
        <ItemSelect title="" taskStatuses={["To Do", "In Progress", "Done"]} />
      </section>
      <section className="buttons">
        <button className={`${classes.taskEdit_button} ${classes.btnControl}`}>
          Save Changes
        </button>
        <button
          className={`${classes.taskEdit_button} ${classes.btnControl}`}
          onClick={() => setEditTask(!editTask)}
        >
          Cancel
        </button>
      </section>
    </div>
  );
};

export default TaskEdit;
