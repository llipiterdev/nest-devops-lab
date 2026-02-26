import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './entities/task.interface';
import { TaskPriority } from './entities/task-priority.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class TasksService {
  private readonly tasks: Task[] = [];

  create(createTaskDto: CreateTaskDto): Task {
    const task: Task = {
      id: randomUUID(),
      title: createTaskDto.title.trim(),
      completed: createTaskDto.completed ?? false,
      createdAt: new Date(),
      priority: createTaskDto.priority ?? TaskPriority.MEDIUM,
      dueDate: createTaskDto.dueDate
        ? new Date(createTaskDto.dueDate)
        : undefined,
    };
    this.tasks.push(task);
    return task;
  }

  findAll(completed?: boolean): Task[] {
    if (completed === undefined) {
      return [...this.tasks];
    }
    return this.tasks.filter((t) => t.completed === completed);
  }

  findOne(id: string): Task {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) {
      throw new NotFoundException(`Tarea con id "${id}" no encontrada`);
    }
    return task;
  }

  update(id: string, updateTaskDto: UpdateTaskDto): Task {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new NotFoundException(`Tarea con id "${id}" no encontrada`);
    }
    if (updateTaskDto.title !== undefined) {
      this.tasks[index].title = updateTaskDto.title.trim();
    }
    if (updateTaskDto.completed !== undefined) {
      this.tasks[index].completed = updateTaskDto.completed;
    }
    if (updateTaskDto.priority !== undefined) {
      this.tasks[index].priority = updateTaskDto.priority;
    }
    if (updateTaskDto.dueDate !== undefined) {
      this.tasks[index].dueDate = new Date(updateTaskDto.dueDate);
    }
    return this.tasks[index];
  }

  remove(id: string): void {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new NotFoundException(`Tarea con id "${id}" no encontrada`);
    }
    this.tasks.splice(index, 1);
  }

  findAllCompleted(): Task[] {
    return this.tasks.filter((t) => t.completed);
  }

  findAllPending(): Task[] {
    return this.tasks.filter((t) => !t.completed);
  }

  findByPriority(priority: TaskPriority): Task[] {
    return this.tasks.filter((t) => t.priority === priority);
  }
}
