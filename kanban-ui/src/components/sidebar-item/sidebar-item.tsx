import React from "react";
import boardIcon from "../../assets/icon-board.svg";
import classes from "./sidebar-item.module.css";

const SideBarItem = ({ name, id, handleSelectedBoard }: any) => {
  return (
    <>
      <li
        className={classes.sidebarItem}
        onClick={() => handleSelectedBoard(id)}
      >
        {" "}
        <span>
          <img src={boardIcon} className={classes.boardIcon} alt="board icon" />
        </span>
        {name}
      </li>
    </>
  );
};

export default SideBarItem;
