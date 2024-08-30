import classes from "./item-select.module.css";
import chevronDown from "../../assets/icon-chevron-down.svg";

interface ItemSelectProps {
  title: string;
  taskStatuses: any;
  selected: string;
  setCurrentStatus: any;
}

const ItemSelect = ({
  title,
  taskStatuses,
  selected,
  setCurrentStatus,
}: ItemSelectProps) => {
  return (
    // @ts-ignore
    <>
      <p className={classes.status_container_header}>{title}</p>
      <span className={classes.select_container}>
        <select
          className={classes.status_select}
          value={selected}
          onChange={(e) => setCurrentStatus(e.target.value)}
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
