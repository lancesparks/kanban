export interface ITask {
  ID: number;
  description: string | null;
  status: string | null;
  title: string | null;
  subtasks: ISubtask[];
}

export interface ISubtask {
  ID: number;
  taskId: number;
  title: string;
  isCompleted: boolean;
}
