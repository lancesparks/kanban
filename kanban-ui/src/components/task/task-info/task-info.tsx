import { useState } from "react";
import classes from "./task-info.module.css";
import { ISubtask, ITask } from "../../../interfaces";
import SubTaskInfo from "../../subtask-info/subtask-info";
import ellipsis from "../../../assets/icon-vertical-ellipsis.svg";
import ItemSelect from "../../item-select/item-select";

interface TaskInfoProps {
  task: ITask;
  subtaskStatus: {
    count: number;
    completed: number;
  };
  handleEditMode: any;
  handleSetSubTaskStatus: any;
}

const TaskInfo = ({
  task,
  subtaskStatus,
  handleEditMode,
  handleSetSubTaskStatus,
}: TaskInfoProps) => {
  const [showEditTaskMenu, setShowEditTaskMenu] = useState(false);
  const subtasks = task.subtasks.sort((a, b) => a.ID - b.ID);

  return (
    // @ts-ignore
    <div className={classes.taskInfo_container}>
      <section className="taskInfo">
        <h1 className={classes.taskInfo_title}>
          {task.title}{" "}
          <span
            className={classes.taskEdit_icon}
            onClick={() => setShowEditTaskMenu(!showEditTaskMenu)}
          >
            <img src={ellipsis} alt="" />
          </span>
        </h1>
        <p className={classes.taskInfo_description}>{task.description}</p>
        {showEditTaskMenu && (
          <div
            className={classes.taskEdit_menu}
            onClick={() => handleEditMode()}
          >
            <p>Edit Task</p>
          </div>
        )}
      </section>
      <section className="subTaskArea">
        <div>
          <p className={classes.subTaskArea_count}>
            Subtasks ( {subtaskStatus.completed} of {subtaskStatus.count} )
          </p>
          {subtasks?.length > 0 &&
            subtasks?.map((subtask: ISubtask) => {
              return (
                <div key={subtask.ID}>
                  <SubTaskInfo
                    taskId={task.ID}
                    handleSetSubTaskStatus={handleSetSubTaskStatus}
                    subtask={subtask}
                  ></SubTaskInfo>
                </div>
              );
            })}
        </div>
      </section>
      <section className={classes.status_container}>
        <ItemSelect
          title={"Current Status"}
          taskStatuses={["To Do", "In Progress", "Done"]}
        ></ItemSelect>
      </section>
    </div>
  );
};

export default TaskInfo;
