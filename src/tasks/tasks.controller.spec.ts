import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.interface';

const mockTask: Task = {
  id: 'test-id',
  title: 'Test task',
  completed: false,
  createdAt: new Date(),
};

const mockService = {
  create: jest.fn().mockReturnValue(mockTask),
  findAll: jest.fn().mockReturnValue([mockTask]),
  findOne: jest.fn().mockReturnValue(mockTask),
  update: jest.fn().mockReturnValue({ ...mockTask, title: 'Updated' }),
  remove: jest.fn(),
  findAllCompleted: jest.fn().mockReturnValue([]),
};

describe('TasksController', () => {
  let controller: TasksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [{ provide: TasksService, useValue: mockService }],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('debería llamar al servicio create y devolver la tarea', () => {
      const dto: CreateTaskDto = { title: 'Nueva tarea' };
      expect(controller.create(dto)).toEqual(mockTask);
      expect(mockService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('debería devolver el array del servicio', () => {
      expect(controller.findAll()).toEqual([mockTask]);
      expect(mockService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('debería devolver la tarea del servicio', () => {
      expect(controller.findOne('test-id')).toEqual(mockTask);
      expect(mockService.findOne).toHaveBeenCalledWith('test-id');
    });
  });

  describe('update', () => {
    it('debería llamar al servicio update con id y dto', () => {
      const dto: UpdateTaskDto = { title: 'Updated' };
      expect(controller.update('test-id', dto)).toMatchObject({
        title: 'Updated',
      });
      expect(mockService.update).toHaveBeenCalledWith('test-id', dto);
    });
  });

  describe('remove', () => {
    it('debería llamar al servicio remove', () => {
      controller.remove('test-id');
      expect(mockService.remove).toHaveBeenCalledWith('test-id');
    });
  });

  describe('findAllCompleted', () => {
    it('debería devolver las tareas completadas del servicio', () => {
      expect(controller.findAllCompleted()).toEqual([]);
      expect(mockService.findAllCompleted).toHaveBeenCalled();
    });
  });
});
