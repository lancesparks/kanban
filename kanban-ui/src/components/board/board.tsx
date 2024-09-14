import classes from "./board.module.css";
import { ITask } from "../../interfaces";
import Task from "../task/task";
import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";
import AddBoardModal from "../addBoard/addBoard";
import { updateBoard } from "../../state/board-action";
import { AppDispatch } from "../../state/store";
const Board = () => {
  const currentBoard = useSelector(({ boards }: any) => boards.selectedBoard);
  const columns = useSelector(({ boards }: any) => boards.columns);
  const dispatch = useDispatch<AppDispatch>();
  const dialog = useRef<HTMLDialogElement>();

  const handleDialog = (e: any) => {
    if (dialog.current) {
      // @ts-ignore
      dialog.current.open();
    }
  };

  const handleSaveChanges = (currentBoardState: any, columns: any) => {
    if (!currentBoard) {
      return;
    }

    let updatedColumns = columns.length > 0 ? columns : null;

    if (updatedColumns && updatedColumns.length > 0) {
      updatedColumns = updatedColumns
        .filter((col: any) => col.title !== "")
        .map((col: any) => {
          return {
            ...col,
            title: col.title.toUpperCase(),
          };
        });
    }

    const updatedBoard = { ...currentBoard, columns: updatedColumns };

    dispatch(updateBoard(updatedBoard));
    dialog.current?.close();
  };

  return (
    <>
      <AddBoardModal
        title={"Edit Board"}
        currentBoard={currentBoard}
        handleSaveChanges={handleSaveChanges}
        ref={dialog}
      />
      {columns?.map((col: any) => {
        return (
          <section className={classes.taskColumn} key={col.ID}>
            <h3 className={classes.columnTitle}>
              {col?.title} ({col?.tasks?.length})
            </h3>

            {col?.tasks &&
              col?.tasks.map((task: ITask) => {
                return <Task key={task.ID} task={task} />;
              })}
          </section>
        );
      })}

      <section className={classes.addColumnSection} onClick={handleDialog}>
        <h1 className="headingXL"> + Add New Column</h1>
      </section>
    </>
  );
};

export default Board;
