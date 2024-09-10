import { useEffect, useState } from "react";
import classes from "./board.module.css";
import { ITask } from "../../interfaces";
import { groupBy } from "lodash";
import Task from "../task/task";
import { taskActions } from "../../state/taskSlice";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../state/store";
const Board = () => {
  const columns = useSelector(({ tasks }: any) => tasks.tasks);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <>
      {columns.map((col: any) => {
        return (
          <section className={classes.taskColumn} key={col.ID}>
            <h3 className={classes.columnTitle}>
              {col.title} ({col?.tasks?.length})
            </h3>
            {col.tasks.map((task: ITask) => {
              return <Task key={task.ID} task={task} />;
            })}
          </section>
        );
      })}

      {/* {Object.keys(columns).map((key: any, index: number) => {
        return (
          <section className={classes.taskColumn} key={index}>
            <h3 className={classes.columnTitle}>
              {key} ({columns[key].length})
            </h3>

            {columns[key].map((task: ITask, index: number) => {
              return (
                <Task key={index} task={task} taskStatuses={taskStatuses} />
              );
            })}
          </section>
        );
      })} */}
    </>
  );
};

export default Board;
