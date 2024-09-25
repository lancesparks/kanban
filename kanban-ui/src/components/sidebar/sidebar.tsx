import classes from "./sidebar.module.css";
import SideBarItem from "../sidebar-item/sidebar-item";
import hideIcon from "../../assets/icon-hide-sidebar.svg";
import lightTheme from "../../assets/icon-light-theme.svg";
import darkTheme from "../../assets/icon-dark-theme.svg";
import AddBoardModal from "../addBoard/addBoard";
import { useRef, useState } from "react";
import { AppDispatch } from "../../state/store";
import { useDispatch, useSelector } from "react-redux";
import { createBoard } from "../../state/board-action";
import { IBoard } from "../../interfaces";
import { boardActions } from "../../state/boardSlice";

const SideBar = ({
  boardTypes,
  handleSelectedBoard,
  hideSideBar,
  handleHideSideBar,
}: any) => {
  const dialog = useRef<HTMLDialogElement>();
  const dispatch = useDispatch<AppDispatch>();
  const isDarkMode = useSelector(({ boards }: any) => boards?.isDarkMode);

  const handleSetIsDarkMode = () => {
    dispatch(boardActions.toggleDarkMode(!isDarkMode));
  };

  const handleDialog = (e: any) => {
    if (dialog.current) {
      // @ts-ignore
      dialog.current.open();
    }
  };

  const handleSaveChanges = (currentBoardState: any, columns: any) => {
    const newBoard = {
      ...currentBoardState,
      columns: columns
        .map((col: any) => {
          return {
            title: col.title,
          };
        })
        .filter((title: any) => title.title !== ""),
    };

    if (newBoard.columns.length === 0) {
      dispatch(createBoard({ ...newBoard, columns: null }));
      return;
    }

    dispatch(createBoard(newBoard));
  };

  const getSideBarClasses = () => {
    if (isDarkMode) {
      return hideSideBar
        ? `${classes.sidebarContainer} ${classes.hideSideBar} ${classes.sidebarContainerDark}`
        : `${classes.sidebarContainer} ${classes.showSideBar} ${classes.sidebarContainerDark}`;
    }

    if (!isDarkMode) {
      return hideSideBar
        ? `${classes.sidebarContainer} ${classes.hideSideBar} ${classes.sidebarContainerLight}`
        : `${classes.sidebarContainer} ${classes.showSideBar} ${classes.sidebarContainerLight}`;
    }
  };

  return (
    <div className={getSideBarClasses()}>
      <AddBoardModal
        title={"Add New Board"}
        currentBoard={null}
        handleSaveChanges={handleSaveChanges}
        ref={dialog}
      />
      <div>
        <h2 className={classes.sidebarContainer_header}>all boards</h2>
        <ul className={classes.sidebarContainer_list}>
          {boardTypes.map((boardType: IBoard) => (
            <SideBarItem
              name={boardType.name}
              id={boardType.ID}
              key={boardType.ID}
              handleSelectedBoard={handleSelectedBoard}
            />
          ))}

          <SideBarItem
            name={"+ Create New Board"}
            id={"newBoard"}
            handleSelectedBoard={handleDialog}
          ></SideBarItem>
        </ul>
      </div>

      <div className={classes.settingsContainer}>
        <div className="settings">
          <div
            className={
              isDarkMode
                ? `${classes.modeControl} ${classes.modeControlDark}`
                : `${classes.modeControl} ${classes.modeControlLight}`
            }
          >
            <div className={classes.switches}>
              <img src={lightTheme} alt="" className={classes.lightTheme} />
              <label className={classes.switch}>
                <input
                  type="checkbox"
                  checked={isDarkMode}
                  onChange={handleSetIsDarkMode}
                />
                <span className={`${classes.slider} ${classes.round}`}></span>
              </label>
              <img src={darkTheme} alt="" className={classes.darkTheme} />
            </div>
          </div>
          <div className={classes.hideContainer} onClick={handleHideSideBar}>
            <p className={classes.hide}>
              <img src={hideIcon} />
              <span>Hide Sidebar</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
