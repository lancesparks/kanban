import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import classes from "./confirm-dialog.module.css";
import { createPortal } from "react-dom";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../state/store";

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

  return createPortal(
    // @ts-ignore
    <dialog ref={dialog} className={`modal ${classes.modalContainer} `}>
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
