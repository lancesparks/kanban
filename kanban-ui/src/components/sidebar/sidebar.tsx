import React from "react";
import classes from "./sidebar.module.css";
import SideBarItem from "../sidebar-item/sidebar-item";
import hideIcon from "../../assets/icon-hide-sidebar.svg";
import lightTheme from "../../assets/icon-light-theme.svg";
import darkTheme from "../../assets/icon-dark-theme.svg";
import { Board } from "../../interfaces";

const SideBar = ({ boardTypes, handleSelectedBoard }: any) => {
  return (
    <div className={classes.sidebarContainer}>
      <div>
        <h2 className={classes.sidebarContainer_header}>all boards</h2>
        <ul className={classes.sidebarContainer_list}>
          {boardTypes.map((boardType: Board) => (
            <SideBarItem
              name={boardType.name}
              id={boardType.ID}
              key={boardType.ID}
              handleSelectedBoard={handleSelectedBoard}
            />
          ))}
        </ul>
      </div>

      <div className={classes.settingsContainer}>
        <div className="settings">
          <div className={classes.modeControl}>
            <div className={classes.switches}>
              <img src={lightTheme} alt="" className={classes.lightTheme} />
              <label className={classes.switch}>
                <input type="checkbox" />
                <span className={`${classes.slider} ${classes.round}`}></span>
              </label>
              <img src={darkTheme} alt="" className={classes.darkTheme} />
            </div>
          </div>
          <div className={classes.hideContainer}>
            <p className={classes.hide}>
              <img src={hideIcon} />
              Hide Sidebar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
