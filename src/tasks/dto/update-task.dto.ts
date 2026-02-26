import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsDateString,
  MinLength,
  MaxLength,
} from 'class-validator';
import { TaskPriority } from '../entities/task-priority.enum';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'El título no puede estar vacío' })
  @MaxLength(200, { message: 'El título no puede superar 200 caracteres' })
  title?: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @IsOptional()
  @IsEnum(TaskPriority, {
    message: 'La prioridad debe ser low, medium o high',
  })
  priority?: TaskPriority;

  @IsOptional()
  @IsDateString(
    {},
    { message: 'dueDate debe ser una fecha válida en formato ISO 8601' },
  )
  dueDate?: string;
}
