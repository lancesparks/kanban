import React, { useEffect, useState } from "react";
import { ReactComponent as BoardIcon } from "../../assets/icon-board.svg";
import classes from "./sidebar-item.module.css";
import { useSelector } from "react-redux";

const SideBarItem = ({ name, id, handleSelectedBoard }: any) => {
  const selectedBoard = useSelector(({ boards }: any) => boards.selectedBoard);
  const [itemClasses, setItemClasses] = useState([""]);

  useEffect(() => {
    setItemClasses([""]);

    if (id === "newBoard") {
      setItemClasses([classes.newBoard]);
    } else {
      setItemClasses([classes.sidebarItem]);
    }

    if (selectedBoard?.ID === id) {
      setItemClasses((prev) => {
        return [...prev, classes.sideBarItemActive];
      });
    }
  }, [selectedBoard]);

  return (
    <>
      <li
        className={itemClasses.join(" ")}
        onClick={() => handleSelectedBoard(id)}
      >
        <span className={classes.boardIcon}>
          <BoardIcon />
        </span>
        {name}
      </li>
    </>
  );
};

export default SideBarItem;
