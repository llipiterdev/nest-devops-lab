import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  ParseBoolPipe,
  ParseEnumPipe,
  Logger,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskPriority } from './entities/task-priority.enum';

@Controller('tasks')
export class TasksController {
  private readonly logger = new Logger(TasksController.name);

  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    const task = this.tasksService.create(createTaskDto);
    this.logger.log(`Tarea creada: id=${task.id}, title="${task.title}"`);
    return task;
  }

  @Get()
  findAll(
    @Query('completed', new ParseBoolPipe({ optional: true }))
    completed?: boolean,
  ) {
    return this.tasksService.findAll(completed);
  }

  @Get('completed')
  findAllCompleted() {
    return this.tasksService.findAllCompleted();
  }

  @Get('pending')
  findAllPending() {
    return this.tasksService.findAllPending();
  }

  @Get('priority/:level')
  findByPriority(
    @Param('level', new ParseEnumPipe(TaskPriority))
    level: TaskPriority,
  ) {
    return this.tasksService.findByPriority(level);
  }

  @Get('stats')
  getStats() {
    return this.tasksService.getStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    const task = this.tasksService.update(id, updateTaskDto);
    this.logger.log(`Tarea actualizada: id=${id}`);
    return task;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    this.tasksService.remove(id);
    this.logger.log(`Tarea eliminada: id=${id}`);
  }
}
