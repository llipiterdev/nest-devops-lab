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
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskPriority } from './entities/task-priority.enum';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
