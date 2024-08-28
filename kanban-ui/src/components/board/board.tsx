import { useEffect, useState } from "react";
import classes from "./board.module.css";
import { ITask } from "../../interfaces";
import { groupBy } from "lodash";
import Task from "../task/task";
const Board = ({ tasks }: any) => {
  const [columns, setColumns] = useState<Record<string, ITask[]>>({});

  useEffect(() => {
    if (!tasks) {
      return;
    }

    const grouped = groupBy(tasks, "status");
    setColumns((prev: any) => {
      return { ...grouped };
    });
  }, [tasks]);

  return (
    <>
      {Object.keys(columns).map((key: any, index: number) => {
        return (
          <section className={classes.taskColumn} key={index}>
            <h3 className={classes.columnTitle}>
              {key} ({columns[key].length})
            </h3>

            {columns[key].map((task: ITask, index: number) => {
              return <Task task={task} key={index} />;
            })}
          </section>
        );
      })}
    </>
  );
};

export default Board;
