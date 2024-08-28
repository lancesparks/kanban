import { useEffect, useState } from "react";
import { IBoard, ITask } from "./interfaces";
import "./App.css";
import Header from "./components/header/header";
import Sidebar from "./components/sidebar/sidebar";
import Board from "./components/board/board";
import axios from "axios";
function App() {
  const [boards, setBoards] = useState([]);
  const [selectedBoardID, setSelectedBoardID] = useState(1);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8080/boards")
      .then((response: any) => {
        setBoards(() => {
          return response.data.boards.map((board: IBoard) => {
            return { ID: board.ID, name: board.name };
          });
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [boards.length]);

  useEffect(() => {
    if (!selectedBoardID) {
      return;
    }
    axios
      .get(`http://127.0.0.1:8080/boards/tasks/${selectedBoardID}`)
      .then((response: any) => {
        setTasks(() => {
          return response.data.tasks.map((task: ITask) => {
            return {
              ID: task.ID,
              title: task.title,
              description: task.description,
              status: task.status,
              subtasks: task.subtasks,
            };
          });
        });
      })
      .catch((error) => {
        console.log(error);
      });
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
          {boards.map((board: IBoard) => {
            if (board.ID === selectedBoardID) {
              return <Board key={board.ID} boardID={board.ID} tasks={tasks} />;
            }
          })}
        </div>
      </main>
    </div>
  );
}

export default App;
