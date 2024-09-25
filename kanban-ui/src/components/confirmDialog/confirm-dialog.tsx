import { forwardRef, useImperativeHandle, useRef } from "react";
import classes from "./confirm-dialog.module.css";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";

interface ConfirmDialogProps {
  dialogTitle: string;
  dialogText: string;
  handleCloseDialog: any;
  handleDelete: any;
}

const ConfirmDialog = forwardRef(function ConfirmDialog(
  {
    dialogTitle,
    dialogText,
    handleCloseDialog,
    handleDelete,
  }: ConfirmDialogProps,
  ref: any
) {
  const dialog = useRef<HTMLDialogElement>();
  const modal = document.getElementById("root");
  const isDarkMode = useSelector(({ boards }: any) => boards?.isDarkMode);

  useImperativeHandle(ref, () => {
    return {
      open() {
        dialog.current?.showModal();
      },
    };
  });

  const handleConfirmClick = () => {
    handleDelete();
    handleCloseDialog();
  };

  const getClasses = () => {
    if (isDarkMode) {
      return `modal ${classes.modalContainer} ${classes.dark}`;
    } else {
      return `modal ${classes.modalContainer} ${classes.light}`;
    }
  };

  return createPortal(
    // @ts-ignore
    <dialog ref={dialog} className={getClasses()}>
      <div className={classes.modalContent}>
        <div>
          <h1 className={classes.modalTitle}>{dialogTitle}</h1>
        </div>
        <div>
          <p className={classes.modalText}>{dialogText}</p>
        </div>
        <div className={classes.modalButtons}>
          <button
            className={`${classes.modalButton} ${classes.deleteButton}`}
            onClick={handleConfirmClick}
          >
            Delete
          </button>
          <button
            className={`${classes.modalButton} ${classes.cancelButton}`}
            onClick={handleCloseDialog}
          >
            Cancel
          </button>
        </div>
      </div>
    </dialog>,

    modal!
  );
});

export default ConfirmDialog;
