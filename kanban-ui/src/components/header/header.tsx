import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../state/store";
import { deleteBoard, updateBoard } from "../../state/board-action";
import ConfirmDialog from "../confirmDialog/confirm-dialog";
import AddBoardModal from "../addBoard/addBoard";
import classes from "./header.module.css";
import logoLight from "../../assets/logo-light.svg";
import logoDark from "../../assets/logo-dark.svg";
import ellipsis from "../../assets/icon-vertical-ellipsis.svg";
import TaskDialog from "../task/task-dialog/task-dialog";

const Header = () => {
  const dialog = useRef<HTMLDialogElement>();
  const deleteDialog = useRef<HTMLDialogElement>();
  const dispatch = useDispatch<AppDispatch>();
  const isDarkMode = useSelector(({ boards }: any) => boards?.isDarkMode);
  const currentColumns = useSelector(({ boards }: any) => boards.columns);
  const currentBoard = useSelector(({ boards }: any) => boards.selectedBoard);
  const [defaultColumn, setDefaultColumn] = useState<string | null>(
    currentColumns[0]?.ID
  );
  const [showDialog, setShowDialog] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(true);

  const [showBoardMenu, setShowBoardMenu] = useState(false);

  const blankTask = {
    title: "",
    description: "",
    column_id: defaultColumn!,
    subtasks: [],
    status: currentColumns[0]?.title,
  };

  const [defaultTask, setDefaultTask] = useState<any>(blankTask);

  console.log(currentColumns);
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

  const handleDeleteBoard = (e: any) => {
    if (!currentBoard) {
      return;
    }

    dispatch(deleteBoard(currentBoard.ID));
  };

  const handleDialog = () => {
    setShowDialog(true);
    if (dialog.current) {
      // @ts-ignore
      dialog.current.open();
    }
  };

  const handleDeleteDialog = () => {
    setShowDeleteDialog(true);

    setTimeout(() => {
      if (deleteDialog.current) {
        // @ts-ignore
        deleteDialog.current.open();
      }
    });
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  const handleCloseDeleteDialog = () => {
    setShowDeleteDialog(false);
  };

  const handleAddNewTask = () => {
    setDefaultTask(defaultTask);
    handleDialog();
  };

  const handleEditBoard = () => {
    handleDialog();
  };

  const handleShowBoardMenu = () => {
    setShowBoardMenu((prev) => !prev);
  };

  useEffect(() => {
    setDefaultColumn(currentColumns[0]?.ID);
  }, [currentColumns]);

  return (
    <header
      className={
        isDarkMode
          ? `${classes.headerContainer} ${classes.headerContainerDark}`
          : `${classes.headerContainer} ${classes.headerContainerLight}`
      }
    >
      {defaultColumn && showDialog && !showBoardMenu && (
        <TaskDialog
          defaultTask={blankTask}
          editMode={false}
          handleCloseDialog={handleCloseDialog}
          addTask={true}
          ref={dialog}
        />
      )}

      {showBoardMenu && (
        <AddBoardModal
          title={"Edit Board"}
          currentBoard={currentBoard}
          handleSaveChanges={handleSaveChanges}
          ref={dialog}
        />
      )}

      {showDeleteDialog && (
        <ConfirmDialog
          dialogTitle="Delete Board"
          dialogText={`Are you sure you want to delete the '${currentBoard?.name}' board? This action will remove all columns and tasks and cannot be reversed.`}
          handleCloseDialog={handleCloseDeleteDialog}
          handleDelete={handleDeleteBoard}
          ref={deleteDialog}
        ></ConfirmDialog>
      )}

      <div
        className={
          isDarkMode
            ? `${classes.containerLogo} ${classes.containerLogoDark}`
            : `${classes.containerLogo} ${classes.containerLogoLight}`
        }
      >
        <img
          src={isDarkMode ? logoLight : logoDark}
          className={classes.containerLogo_logo}
          alt="logo"
        ></img>
      </div>
      <div className={classes.headerContainer_actions}>
        <h1 className={classes.header}>Platform Launch</h1>

        <div className={classes.action_container}>
          <button
            className={
              currentColumns.length === 0
                ? classes.addBtnDisabled
                : classes.addBtn
            }
            onClick={handleAddNewTask}
            disabled={currentColumns.length === 0}
          >
            + Add New Task
          </button>
          <img
            src={ellipsis}
            alt="ellipsis"
            className={classes.ellipsis}
            onClick={handleShowBoardMenu}
          ></img>

          {showBoardMenu && (
            <section
              className={
                isDarkMode
                  ? `${classes.boardMenu} ${classes.boardMenuDark}`
                  : `${classes.boardMenu} ${classes.boardMenuLight}`
              }
              onBlur={handleShowBoardMenu}
            >
              <p className={classes.boardMenuEdit} onClick={handleEditBoard}>
                Edit Board
              </p>
              <p
                className={classes.boardMenuDelete}
                onClick={handleDeleteDialog}
              >
                Delete Board
              </p>
            </section>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
