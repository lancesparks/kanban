import { useEffect, useState } from "react";
import { IBoard, ITask } from "./interfaces";
import "./App.css";
import Header from "./components/header/header";
import Sidebar from "./components/sidebar/sidebar";
import Board from "./components/board/board";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "./state/store";

import { getAllBoards, getBoardColumns } from "./state/board-action";

function App() {
  const [selectedBoardID, setSelectedBoardID] = useState(1);
  const dispatch = useDispatch<AppDispatch>();
  const columns = useSelector(({ boards }: any) => boards.columns);
  const boards = useSelector(({ boards }: any) => boards.boards);

  useEffect(() => {
    dispatch(getAllBoards());
  }, [columns]);

  useEffect(() => {
    dispatch(getBoardColumns(selectedBoardID));
  }, [selectedBoardID]);

  const handleSelectedBoard = (boardId: any) => {
    setSelectedBoardID(boardId);
  };

  return (
    <div className="App">
      <Header></Header>
      <main className="main">
        <aside>
          <Sidebar
            boardTypes={boards}
            handleSelectedBoard={handleSelectedBoard}
          ></Sidebar>
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
