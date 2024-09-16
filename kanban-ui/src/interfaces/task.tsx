export interface ITask {
  ID?: number;
  description: string | null;
  status: string | null;
  title: string | null;
  subtasks: ISubtask[];
  column_id: string | number;
}

export interface ISubtask {
  ID: number;
  task_id: number;
  title: string;
  isCompleted: boolean;
}
