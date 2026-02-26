import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './entities/task.interface';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class TasksService {
  private readonly tasks: Task[] = [];

  create(createTaskDto: CreateTaskDto): Task {
    const task: Task = {
      id: randomUUID(),
      title: createTaskDto.title,
      completed: createTaskDto.completed ?? false,
      createdAt: new Date(),
    };
    this.tasks.push(task);
    return task;
  }

  findAll(): Task[] {
    return [...this.tasks];
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
      this.tasks[index].title = updateTaskDto.title;
    }
    if (updateTaskDto.completed !== undefined) {
      this.tasks[index].completed = updateTaskDto.completed;
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
}
