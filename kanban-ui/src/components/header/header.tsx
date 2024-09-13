import classes from "./header.module.css";
import logo from "../../assets/logo-light.svg";
import ellipsis from "../../assets/icon-vertical-ellipsis.svg";
import AddBoardModal from "../addBoard/addBoard";
import { useRef } from "react";

const Header = () => {
  const dialog = useRef<HTMLDialogElement>();

  const handleDialog = (e: any) => {
    if (dialog.current) {
      // @ts-ignore
      dialog.current.open();
    }
  };

  return (
    <header className={classes.headerContainer}>
      <AddBoardModal title={"Add New Board"} currentBoard={null} ref={dialog} />
      <div className={classes.containerLogo}>
        <img src={logo} className={classes.containerLogo_logo} alt="logo"></img>
        {/* <h1 className="containerLogo_appLogo">kanban</h1> */}
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
