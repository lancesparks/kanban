import classes from "./header.module.css";
import logo from "../../assets/logo-light.svg";
import ellipsis from "../../assets/icon-vertical-ellipsis.svg";
import TaskDialog from "../task/task-dialog/task-dialog";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const Header = () => {
  const dialog = useRef<HTMLDialogElement>();
  const currentColumns = useSelector(({ boards }: any) => boards.columns);
  const [defaultColumn, setDefaultColumn] = useState<string | null>(
    currentColumns[0]?.ID
  );
  const [showDialog, setShowDialog] = useState(true);

  const blankTask = {
    title: "",
    description: "",
    column_id: defaultColumn!,
    subtasks: [],
    status: currentColumns[0]?.title,
  };

  const [defaultTask, setDefaultTask] = useState<any>(blankTask);

  const handleDialog = (e: any) => {
    setDefaultTask(defaultTask);
    setShowDialog(true);
    if (dialog.current) {
      // @ts-ignore
      dialog.current.open();
    }
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  useEffect(() => {
    setDefaultColumn(currentColumns[0]?.ID);
  }, [currentColumns]);

  return (
    <header className={classes.headerContainer}>
      {defaultColumn && showDialog && (
        <TaskDialog
          defaultTask={defaultTask}
          editMode={false}
          handleCloseDialog={handleCloseDialog}
          addTask={true}
          ref={dialog}
        />
      )}

      <div className={classes.containerLogo}>
        <img src={logo} className={classes.containerLogo_logo} alt="logo"></img>
      </div>
      <div className={classes.headerContainer_actions}>
        <h1 className={classes.header}>Platform Launch</h1>

        <div className={classes.action_container}>
          <button className={classes.addBtn} onClick={handleDialog}>
            + Add New Task
          </button>
          <img src={ellipsis} alt="ellipsis" className={classes.ellipsis}></img>
        </div>
      </div>
    </header>
  );
};

export default Header;
