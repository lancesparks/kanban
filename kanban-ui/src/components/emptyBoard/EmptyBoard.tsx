import classes from "./emptyBoard.module.css";
import AddBoardModal from "../addBoard/addBoard";
import { useRef } from "react";
import { AppDispatch } from "../../state/store";
import { useDispatch } from "react-redux";
import { updateBoard } from "../../state/board-action";
import { boardActions } from "../../state/boardSlice";

const EmptyBoard = ({ currentBoard }: any) => {
  const dialog = useRef<HTMLDialogElement>();
  const dispatch = useDispatch<AppDispatch>();

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
  };

  return (
    <div className={classes.emptyBoardContainer}>
      <AddBoardModal
        title={"Add New Column"}
        currentBoard={currentBoard}
        handleSaveChanges={handleSaveChanges}
        ref={dialog}
      />
      <div className={classes.emptyBoardContainerMain}>
        <h1>This board is empty. Create a new column to get started.</h1>
        <button className={`${classes.addBtn}`} onClick={handleDialog}>
          + Add New Column
        </button>
      </div>
    </div>
  );
};

export default EmptyBoard;
