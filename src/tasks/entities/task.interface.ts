import { TaskPriority } from './task-priority.enum';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  priority: TaskPriority;
  dueDate?: Date;
}
