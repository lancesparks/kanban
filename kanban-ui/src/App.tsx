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
  const [selectedBoardID, setSelectedBoardID] = useState(1);
  const dispatch = useDispatch<AppDispatch>();
  const boards = useSelector(({ boards }: any) => boards.boards);
  const [hideSideBar, setHideSideBar] = useState(false);

  useEffect(() => {
    dispatch(getAllBoards());
  }, []);

  useEffect(() => {
    if (!boards || boards.length === 0) {
      return;
    }
    const defaultBoardId = boards[0].ID;

    dispatch(getBoardColumns(defaultBoardId));
    handleSelectedBoard(defaultBoardId);
  }, [boards]);

  const handleSelectedBoard = (boardId: any) => {
    const board = boards.find((board: IBoard) => board.ID === boardId);
    dispatch(boardActions.setSelectedBoard(board));

    setSelectedBoardID(boardId);
  };
  const handleHideSideBar = () => {
    setHideSideBar((prev) => !prev);
  };

  return (
    <div className="App">
      <Header></Header>
      <main className="main">
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
        <div className="mainContainer">
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
