import { useEffect, useState } from "react";
import classes from "./board.module.css";
import { ITask } from "../../interfaces";
import { groupBy } from "lodash";
import Task from "../task/task";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../state/store";
const Board = () => {
  const columns = useSelector(({ boards }: any) => boards.columns);
  const tasks = useSelector(({ boards }: any) => boards.tasks);

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
    </>
  );
};

export default Board;
