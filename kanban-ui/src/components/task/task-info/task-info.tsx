import { useEffect, useState } from "react";
import classes from "./task-info.module.css";
import { ISubtask, ITask } from "../../../interfaces";
import SubTaskInfo from "../../subtask-info/subtask-info";
import ellipsis from "../../../assets/icon-vertical-ellipsis.svg";
import ItemSelect from "../../item-select/item-select";
import { AppDispatch } from "../../../state/store";
import { useDispatch, useSelector } from "react-redux";
import { deleteTask } from "../../../state/board-action";

interface TaskInfoProps {
  task: any;
  handleEditMode: any;
  handleDeleteTask: any;
}

const TaskInfo = ({
  task,
  handleEditMode,
  handleDeleteTask,
}: TaskInfoProps) => {
  const [showEditTaskMenu, setShowEditTaskMenu] = useState(false);
  const [subtaskStatus, setSubtaskStatus] = useState({
    count: 0,
    completed: 0,
  });

  useEffect(() => {
    if (!task) {
      return;
    }
    setSubtaskStatus(() => {
      return {
        count: task.subtasks.length,
        completed:
          task.subtasks.length > 0
            ? task.subtasks.filter((subtask: ISubtask) => subtask.isCompleted)
                .length
            : 0,
      };
    });
  }, [task]);

  let subtasks: ISubtask[] | null = null;

  const setSubTasks = (task: ITask): ISubtask[] | null => {
    if (!task) {
      return [];
    }
    if (task.subtasks && task.subtasks.length > 0) {
      const subtasks = [...task.subtasks];
      return subtasks.sort((a: ISubtask, b: ISubtask) => a.ID - b.ID);
    }

    return [];
  };

  subtasks = setSubTasks(task) ?? null;

  return (
    // @ts-ignore
    <div className={classes.taskInfo_container}>
      {task && (
        <>
          <section className="taskInfo">
            <h1 className={classes.taskInfo_title}>
              {task.title}
              <span
                className={classes.taskEdit_icon}
                onClick={() => setShowEditTaskMenu(!showEditTaskMenu)}
              >
                <img src={ellipsis} alt="" />
              </span>
            </h1>
            <p className={classes.taskInfo_description}>{task.description}</p>
            {showEditTaskMenu && (
              <div className={classes.taskEdit_menu}>
                <p onClick={() => handleEditMode()}>Edit Task</p>
              </div>
            )}
          </section>
          <section className="subTaskArea">
            <div>
              <p className={classes.subTaskArea_count}>
                Subtasks ( {subtaskStatus.completed} of {subtaskStatus.count} )
              </p>
              {subtasks &&
                subtasks?.length > 0 &&
                subtasks?.map((subtask: ISubtask) => {
                  return (
                    <div key={subtask.ID}>
                      <SubTaskInfo
                        taskId={task.ID}
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
              task={task}
              isEditMode={false}
            ></ItemSelect>
          </section>
        </>
      )}
    </div>
  );
};

export default TaskInfo;
