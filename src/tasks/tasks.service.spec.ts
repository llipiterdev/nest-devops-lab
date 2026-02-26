import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debería crear una tarea con título y completed por defecto false', () => {
      const dto: CreateTaskDto = { title: 'Mi tarea' };
      const task = service.create(dto);
      expect(task.title).toBe('Mi tarea');
      expect(task.completed).toBe(false);
      expect(task.id).toBeDefined();
      expect(task.createdAt).toBeInstanceOf(Date);
    });

    it('debería crear una tarea con completed true si se indica', () => {
      const dto: CreateTaskDto = { title: 'Hecha', completed: true };
      const task = service.create(dto);
      expect(task.completed).toBe(true);
    });
  });

  describe('findAll', () => {
    it('debería devolver array vacío al inicio', () => {
      expect(service.findAll()).toEqual([]);
    });

    it('debería devolver todas las tareas creadas', () => {
      service.create({ title: 'A' });
      service.create({ title: 'B' });
      const all = service.findAll();
      expect(all).toHaveLength(2);
      expect(all.map((t) => t.title)).toContain('A');
      expect(all.map((t) => t.title)).toContain('B');
    });
  });

  describe('findOne', () => {
    it('debería lanzar NotFoundException si no existe la tarea', () => {
      expect(() => service.findOne('id-inexistente')).toThrow(
        NotFoundException,
      );
    });

    it('debería devolver la tarea cuando existe', () => {
      const created = service.create({ title: 'Una tarea' });
      const found = service.findOne(created.id);
      expect(found).toEqual(created);
    });
  });

  describe('update', () => {
    it('debería lanzar NotFoundException si no existe la tarea', () => {
      expect(() =>
        service.update('id-inexistente', { title: 'Nuevo' }),
      ).toThrow(NotFoundException);
    });

    it('debería actualizar título y completed', () => {
      const created = service.create({ title: 'Original' });
      const updated = service.update(created.id, {
        title: 'Actualizado',
        completed: true,
      });
      expect(updated.title).toBe('Actualizado');
      expect(updated.completed).toBe(true);
    });
  });

  describe('remove', () => {
    it('debería lanzar NotFoundException si no existe la tarea', () => {
      expect(() => service.remove('id-inexistente')).toThrow(NotFoundException);
    });

    it('debería eliminar la tarea y no aparecer en findAll', () => {
      const created = service.create({ title: 'Por borrar' });
      service.remove(created.id);
      expect(service.findAll()).toHaveLength(0);
      expect(() => service.findOne(created.id)).toThrow(NotFoundException);
    });
  });

  describe('findAllCompleted', () => {
    it('debería devolver solo tareas completadas', () => {
      service.create({ title: 'A', completed: false });
      service.create({ title: 'B', completed: true });
      service.create({ title: 'C', completed: true });
      const completed = service.findAllCompleted();
      expect(completed).toHaveLength(2);
      expect(completed.every((t) => t.completed)).toBe(true);
    });
  });
});
