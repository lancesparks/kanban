import { useEffect, useState } from "react";
import { IBoard, ITask } from "./interfaces";
import "./App.css";
import Header from "./components/header/header";
import Sidebar from "./components/sidebar/sidebar";
import Board from "./components/board/board";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "./state/store";
import { getAllBoards, getBoardColumns } from "./state/board-action";
import { boardActions } from "./state/boardSlice";
import showIcon from "./assets/icon-show-sidebar.svg";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const isDarkMode = useSelector(({ boards }: any) => boards?.isDarkMode);

  const boards = useSelector(({ boards }: any) => boards.boards);
  const [selectedBoardID, setSelectedBoardID] = useState(boards[0]?.ID);
  const [hideSideBar, setHideSideBar] = useState(false);

  useEffect(() => {
    dispatch(getAllBoards());
  }, []);

  useEffect(() => {
    if (!boards || boards.length === 0 || selectedBoardID) {
      return;
    }
    const defaultBoardId = boards[0].ID;

    dispatch(getBoardColumns(defaultBoardId));
    handleSelectedBoard(defaultBoardId);
  }, [boards]);

  const handleSelectedBoard = (boardId: any) => {
    const board = boards.find((board: IBoard) => board.ID === boardId);
    dispatch(boardActions.setSelectedBoard(board));
    dispatch(getBoardColumns(board.ID));
    dispatch(boardActions.setSelectedBoard(board));
    setSelectedBoardID(boardId);
  };
  const handleHideSideBar = () => {
    setHideSideBar((prev) => !prev);
  };

  return (
    <div className={isDarkMode ? `App AppDark` : `App AppLight`}>
      <Header></Header>
      <main
        // className="main"
        className={!hideSideBar ? "main" : "main mainSidebarClosed"}
      >
        <aside>
          <Sidebar
            boardTypes={boards}
            handleSelectedBoard={handleSelectedBoard}
            hideSideBar={hideSideBar}
            handleHideSideBar={handleHideSideBar}
          ></Sidebar>

          <div
            className={
              hideSideBar
                ? "showSideBarSection showSideBar"
                : "showSideBarSection hideSideBar"
            }
            onClick={handleHideSideBar}
          >
            <img src={showIcon} alt="" />
          </div>
        </aside>
        <div
          className={
            isDarkMode
              ? `mainContainer mainContainerDark`
              : `mainContainer mainContainerLight`
          }
          id="mainContainer"
        >
          {boards?.map((board: IBoard) => {
            if (board.ID === selectedBoardID) {
              return <Board key={board.ID} />;
            }
          })}
        </div>
      </main>
    </div>
  );
}

export default App;
