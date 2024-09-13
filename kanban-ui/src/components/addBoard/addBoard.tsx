import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import classes from "./addBoard.module.css";
import cross from "../../assets/icon-cross.svg";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../state/store";
import { updateBoard } from "../../state/board-action";

interface BoardProps {
  title: string;
  currentBoard: any;
}

const AddBoardModal = forwardRef(function AddBoardModal(
  { title, currentBoard }: BoardProps,
  ref: any
) {
  const dispatch = useDispatch<AppDispatch>();
  const dialog = useRef<HTMLDialogElement>();
  const modal = document.getElementById("root");
  const [currentBoardState, setCurrentBoardState] = useState(currentBoard);
  const [columns, setColumns] = useState<any[]>(
    currentBoardState ? currentBoardState.columns : [{ ID: "1", title: "" }]
  );

  const handleSetTitle = (e: any) => {
    setCurrentBoardState((prev: any) => {
      return {
        ...prev,
        name: e.target.value,
      };
    });
  };

  const handleSetColumnTitle = (e: any, col: any) => {
    const updatedCol = { ...col, title: e.target.value };
    setColumns((prev: any) => {
      return prev.map((col: any) => {
        if (col.ID === updatedCol.ID) {
          return updatedCol;
        }
        return col;
      });
    });
  };

  const handleAddColumn = (e: any) => {
    e.preventDefault();
    setColumns((prev: any) => {
      const newColumn = {
        ID: prev.length > 0 ? prev[prev.length - 1].ID + 2 : 1,
        title: "",
      };
      return [...prev, newColumn];
    });
  };

  const handleSaveChanges = () => {
    if (!currentBoardState) {
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

  const handleDeleteColumn = (col: any) => {
    setColumns((prev: any) => {
      return prev.filter((c: any) => c.ID !== col.ID);
    });
  };

  useImperativeHandle(ref, () => {
    return {
      open() {
        dialog.current?.showModal();
      },
    };
  });

  return createPortal(
    // @ts-ignore
    <dialog className={`modal ${classes.modalContainer}`} ref={dialog}>
      <form method="dialog" className={classes.modalForm}>
        <h1>{title}</h1>
        <section>
          <h3>Board Name</h3>
          {currentBoard && (
            <input
              type="text"
              value={currentBoardState.name}
              className={`edit_input  ${classes.modalInput}`}
              onChange={handleSetTitle}
            />
          )}
          {!currentBoard && (
            <input
              type="text"
              className={classes.modalInput}
              onChange={handleSetTitle}
            />
          )}
        </section>
        <section>
          <h3>Board Columns</h3>
          {columns.map((col: any) => {
            return (
              <div className={classes.boardColumn} key={col.ID}>
                <input
                  type="text"
                  value={col.title}
                  className={`edit_input  ${classes.modalInput}`}
                  onChange={(e) => handleSetColumnTitle(e, col)}
                />
                <img
                  src={cross}
                  className={`${classes.removeBoardColumn} ${classes.cross}`}
                  alt=""
                  onClick={() => handleDeleteColumn(col)}
                />
              </div>
            );
          })}
        </section>
        <section className={classes.btnSection}>
          <button
            className={`${classes.btn}  ${classes.addBtn}`}
            onClick={handleAddColumn}
          >
            + Add New Column
          </button>
          <button
            className={`${classes.btn} ${classes.saveChanges}`}
            onClick={handleSaveChanges}
          >
            Save Changes
          </button>
        </section>
      </form>
    </dialog>,

    modal!
  );
});

export default AddBoardModal;
