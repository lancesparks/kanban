import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  useId,
} from "react";

import { createPortal } from "react-dom";
import classes from "./addBoard.module.css";
import cross from "../../assets/icon-cross.svg";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../state/store";
import { deleteBoard } from "../../state/board-action";

interface BoardProps {
  title: string;
  currentBoard: any;
  handleSaveChanges: any;
}

const AddBoardModal = forwardRef(function AddBoardModal(
  { title, currentBoard, handleSaveChanges }: BoardProps,
  ref: any
) {
  const dispatch = useDispatch<AppDispatch>();
  const dialog = useRef<HTMLDialogElement>();
  const mostRecentColumn = useSelector(
    ({ boards }: any) => boards?.columns.slice(-1)[0]
  );
  const boardColumns = useSelector(({ boards }: any) => boards?.columns);
  const isDarkMode = useSelector(({ boards }: any) => boards?.isDarkMode);
  const modal = document.getElementById("root");
  const [currentBoardState, setCurrentBoardState] = useState(currentBoard);
  const [boardError, setBoardError] = useState(false);
  const [columns, setColumns] = useState<any[]>([]);

  useEffect(() => {
    if (!currentBoard?.columns && mostRecentColumn) {
      setColumns([{ tempID: mostRecentColumn?.ID + 1, title: "" }]);
    }

    if (!currentBoard?.columns && !mostRecentColumn) {
      setColumns([{ tempID: 1, title: "" }]);
    }

    if (currentBoard?.columns && mostRecentColumn) {
      setColumns([
        ...currentBoard?.columns,
        { tempID: mostRecentColumn?.ID + 1, title: "" },
      ]);
    }

    setCurrentBoardState(currentBoard);
  }, [boardColumns]);

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
        if (col.tempID === updatedCol.tempID) {
          return updatedCol;
        }
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
      if (prev.length === 0 && mostRecentColumn) {
        return [{ tempID: mostRecentColumn.ID + 1, title: "" }];
      }

      if (prev.length === 0 && !mostRecentColumn) {
        return [{ tempID: 1, title: "" }];
      }
      return [...prev, { tempID: prev.slice(-1)[0].tempID + 1, title: "" }];
    });
  };

  const handleDeleteColumn = (col: any) => {
    setColumns((prev: any) => {
      return prev.filter((c: any) => {
        if (col.tempID && c.tempID) {
          return c.tempID !== col.tempID;
        }

        return c.ID !== col.ID;
      });
    });
  };

  const saveChanges = (e: any) => {
    if (!currentBoardState || currentBoardState?.name === "") {
      e.preventDefault();
      setBoardError(true);
      return;
    }

    const tempColumns = columns.map((col) => {
      if (col.ID) {
        return {
          ID: col.ID,
          title: col.title.toUpperCase(),
        };
      } else {
        return {
          title: col.title.toUpperCase(),
        };
      }
    });

    handleSaveChanges(currentBoardState, tempColumns);

    setCurrentBoardState(null);
    setBoardError(false);
  };

  const handleDeleteBoard = (e: any) => {
    if (!currentBoard) {
      return;
    }

    dispatch(deleteBoard(currentBoard.ID));
  };

  useImperativeHandle(ref, () => {
    return {
      open() {
        setBoardError(false);
        dialog.current?.showModal();
      },
    };
  });

  const getClasses = () => {
    if (isDarkMode) {
      return `modal ${classes.modalContainer} ${classes.modalContainerDark}`;
    } else {
      return `modal ${classes.modalContainer} ${classes.modalContainerLight}`;
    }
  };

  return createPortal(
    // @ts-ignore
    <dialog className={getClasses()} ref={dialog}>
      <form method="dialog" className={classes.modalForm}>
        <h1 className={classes.boardTitle}>
          {title}
          {boardError && (
            <span className={classes.boardError}>Board name is required</span>
          )}
        </h1>

        <section>
          <h3>Board Name</h3>
          <input
            type="text"
            value={currentBoardState?.name || ""}
            className={`edit_input  ${classes.modalInput} ${
              isDarkMode ? "edit_inputDark" : "edit_inputLight"
            }`}
            onChange={handleSetTitle}
          />
        </section>
        <section>
          <h3>Board Columns</h3>

          {columns &&
            columns?.map((col: any, index: any) => {
              return (
                <div
                  className={classes.boardColumn}
                  key={col.tempID ? col.tempID : col.ID}
                >
                  <input
                    type="text"
                    value={col.title}
                    className={`edit_input  ${classes.modalInput} ${
                      isDarkMode ? "edit_inputDark" : "edit_inputLight"
                    }`}
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
            className={`${classes.btn}  ${
              isDarkMode ? classes.addBtnDark : classes.addBtnLight
            }`}
            onClick={handleAddColumn}
          >
            + Add New Column
          </button>
          <button
            className={`${classes.btn} ${classes.saveChanges}`}
            onClick={saveChanges}
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
