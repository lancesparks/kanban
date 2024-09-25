import classes from "./item-select.module.css";
import chevronDown from "../../assets/icon-chevron-down.svg";
import { useState } from "react";
import { ITask } from "../../interfaces";
import { useSelector, useDispatch } from "react-redux";
import { updateTask } from "../../state/board-action";
import { AppDispatch } from "../../state/store";

interface ItemSelectProps {
  title: string;
  task: ITask;
  isEditMode: boolean;
  statusChanged?: any | null;
}

const ItemSelect = ({
  title,
  task,
  isEditMode = false,
  statusChanged = null,
}: ItemSelectProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const currentBoard = useSelector(({ boards }: any) => boards.selectedBoard);
  const taskStatuses = useSelector(({ boards }: any) => boards.boardStatuses);
  const isDarkMode = useSelector(({ boards }: any) => boards?.isDarkMode);

  const [selected, setSelected] = useState(
    taskStatuses.find((status: any) => +status.ID === +task.column_id)
  );
  const setCurrentStatus = (e: any) => {
    const newStatus = taskStatuses.find((status: any) => +status.ID === +e);

    setSelected(e);
    dispatch(
      updateTask(
        { ...task, status: newStatus.status, column_id: newStatus.ID },
        currentBoard.ID
      )
    );
  };

  const handleStatusChange = (e: any) => {
    const newStatus = taskStatuses.find((status: any) => +status.ID === +e);

    statusChanged(newStatus);
    setSelected(e);
  };

  return (
    // @ts-ignore
    <>
      <p className={classes.status_container_header}>{title}</p>
      <span className={classes.select_container}>
        <select
          className={`${classes.status_select} ${
            isDarkMode ? classes.selectDark : classes.selectLight
          }`}
          value={selected?.ID!}
          onChange={(e) =>
            !isEditMode
              ? setCurrentStatus(e.target.value)
              : handleStatusChange(e.target.value)
          }
        >
          {taskStatuses.map((status: any, index: number) => (
            <option key={index} value={status.ID}>
              {status.status}
            </option>
          ))}
        </select>
        <img src={chevronDown} alt="" className={classes.chevron} />
      </span>
    </>
  );
};

export default ItemSelect;
