import { forwardRef, useImperativeHandle, useRef } from "react";
import { createPortal } from "react-dom";
import classes from "./addBoard.module.css";

const AddBoardModal = forwardRef(function AddBoardModal(_, ref: any) {
  const dialog = useRef<HTMLDialogElement>();
  const modal = document.getElementById("root");

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
        <h1>Add New Board</h1>
        <section>
          <h3>Board Name</h3>
          <input type="text" className={classes.modalInput} />
        </section>
        <section>
          <h3>Board Columns</h3>
          <div className={classes.boardColumn}>
            <input type="text" className={classes.modalInput} />
            <span className={classes.removeBoardColumn}>X</span>
          </div>
        </section>
        <section className={classes.btnSection}>
          <button className={`${classes.btn}  ${classes.addBtn}`}>
            + Add New Column
          </button>
          <button className={`${classes.btn} ${classes.saveChanges}`}>
            Save Changes
          </button>
        </section>
      </form>
    </dialog>,

    modal!
  );
});

export default AddBoardModal;
