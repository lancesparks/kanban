import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Header from "./components/header/header";
import Sidebar from "./components/sidebar/sidebar";
import userEvent from "@testing-library/user-event";
import axios from "axios";
function App() {
  const [boards, setBoards] = useState([]);
  const [selectedBoardID, setSelectedBoardID] = useState(null);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8080/boards")
      .then((response: any) => {
        setBoards(() => {
          return response.data.boards.map((board: any) => {
            return { ID: board.ID, name: board.name };
          });
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [boards.length]);

  useEffect(() => {
    // axios
    //   .get(`http://127.0.0.1:8080/${selectedBoardID}}`)
    //   .then((response: any) => {
    //     setBoards(() => {
    //       return response.data.boards.map((board: any) => {
    //         return { ID: board.ID, name: board.name };
    //       });
    //     });
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
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
        <div className="mainContainer"></div>
      </main>
    </div>
  );
}

export default App;
