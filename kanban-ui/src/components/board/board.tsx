import classes from "./board.module.css";
import { ITask } from "../../interfaces";
import Task from "../task/task";
import { useSelector } from "react-redux";
const Board = () => {
  const columns = useSelector(({ boards }: any) => boards.columns);

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
