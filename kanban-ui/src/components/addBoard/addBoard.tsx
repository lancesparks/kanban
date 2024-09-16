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

interface BoardProps {
  title: string;
  currentBoard: any;
  handleSaveChanges: any;
}

const AddBoardModal = forwardRef(function AddBoardModal(
  { title, currentBoard, handleSaveChanges }: BoardProps,
  ref: any
) {
  const dialog = useRef<HTMLDialogElement>();
  const modal = document.getElementById("root");
  const [currentBoardState, setCurrentBoardState] = useState(currentBoard);
  const [columns, setColumns] = useState<any[]>(
    currentBoardState ? currentBoardState.columns : [{ ID: "1", title: "" }]
  );

  useEffect(() => {
    const close = (e: any) => {
      if (e.keyCode === "Escape" || e.keyCode === 27) {
        setCurrentBoardState(null);
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

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

  const handleDeleteColumn = (col: any) => {
    setColumns((prev: any) => {
      return prev.filter((c: any) => c.ID !== col.ID);
    });
  };

  const saveChanges = () => {
    handleSaveChanges(currentBoardState, columns);
    setCurrentBoardState(null);
    console.log(currentBoardState);
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
          {currentBoardState && (
            <input
              type="text"
              value={currentBoardState.name}
              className={`edit_input  ${classes.modalInput}`}
              onChange={handleSetTitle}
            />
          )}
          {!currentBoardState && (
            <input
              type="text"
              className={classes.modalInput}
              onChange={handleSetTitle}
            />
          )}
        </section>
        <section>
          <h3>Board Columns</h3>
          {columns?.map((col: any) => {
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
