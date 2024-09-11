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

  const taskStatuses =
    useSelector(({ boards }: any) =>
      boards.boardStatuses.map((status: string) => status.toUpperCase())
    ) || [];
  const [selected, setSelected] = useState(task.status);
  const setCurrentStatus = (e: any) => {
    setSelected(e);
    dispatch(updateTask({ ...task, status: e }));
  };

  const handleStatusChange = (e: string) => {
    statusChanged(e);
    setSelected(e);
  };

  return (
    // @ts-ignore
    <>
      <p className={classes.status_container_header}>{title}</p>
      <span className={classes.select_container}>
        <select
          className={classes.status_select}
          value={selected!}
          onChange={(e) =>
            !isEditMode
              ? setCurrentStatus(e.target.value)
              : handleStatusChange(e.target.value)
          }
        >
          {taskStatuses.map((status: string, index: number) => (
            <option key={index} value={status}>
              {status}
            </option>
          ))}
        </select>
        <img src={chevronDown} alt="" className={classes.chevron} />
      </span>
    </>
  );
};

export default ItemSelect;
