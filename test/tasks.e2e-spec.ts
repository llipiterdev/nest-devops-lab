import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { Task } from '../src/tasks/entities/task.interface';

describe('TasksController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /tasks devuelve array vacío al inicio', () => {
    return request(app.getHttpServer())
      .get('/tasks')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body).toHaveLength(0);
      });
  });

  it('POST /tasks crea una tarea y GET /tasks la devuelve', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/tasks')
      .send({ title: 'Tarea e2e' })
      .expect(201);

    const created = createRes.body as Task;
    expect(created.id).toBeDefined();
    expect(created.title).toBe('Tarea e2e');
    expect(created.completed).toBe(false);
    expect(created.priority).toBeDefined();

    const listRes = await request(app.getHttpServer())
      .get('/tasks')
      .expect(200);
    const list = listRes.body as Task[];
    expect(list).toHaveLength(1);
    expect(list[0].title).toBe('Tarea e2e');
  });

  it('GET /tasks/:id devuelve 404 para id inexistente', () => {
    return request(app.getHttpServer())
      .get('/tasks/00000000-0000-0000-0000-000000000000')
      .expect(404);
  });

  it('PATCH /tasks/:id actualiza y DELETE elimina', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/tasks')
      .send({ title: 'Para actualizar' })
      .expect(201);
    const created = createRes.body as Task;
    const id = created.id;

    await request(app.getHttpServer())
      .patch(`/tasks/${id}`)
      .send({ title: 'Actualizada', completed: true })
      .expect(200);

    const getRes = await request(app.getHttpServer())
      .get(`/tasks/${id}`)
      .expect(200);
    const updated = getRes.body as Task;
    expect(updated.title).toBe('Actualizada');
    expect(updated.completed).toBe(true);

    await request(app.getHttpServer()).delete(`/tasks/${id}`).expect(204);

    await request(app.getHttpServer()).get(`/tasks/${id}`).expect(404);
  });

  it('GET /tasks/completed devuelve solo completadas', async () => {
    await request(app.getHttpServer())
      .post('/tasks')
      .send({ title: 'A', completed: false });
    await request(app.getHttpServer())
      .post('/tasks')
      .send({ title: 'B', completed: true });

    const res = await request(app.getHttpServer())
      .get('/tasks/completed')
      .expect(200);
    const completed = res.body as Task[];
    expect(completed).toHaveLength(1);
    expect(completed[0].title).toBe('B');
    expect(completed[0].completed).toBe(true);
  });

  it('POST /tasks con título vacío devuelve 400 por validación', () => {
    return request(app.getHttpServer())
      .post('/tasks')
      .send({ title: '' })
      .expect(400);
  });

  it('POST /tasks con prioridad inválida devuelve 400', () => {
    return request(app.getHttpServer())
      .post('/tasks')
      .send({ title: 'Ok', priority: 'invalid' })
      .expect(400);
  });

  it('GET /tasks/pending devuelve solo pendientes', async () => {
    await request(app.getHttpServer())
      .post('/tasks')
      .send({ title: 'Pendiente', completed: false });
    await request(app.getHttpServer())
      .post('/tasks')
      .send({ title: 'Hecha', completed: true });

    const res = await request(app.getHttpServer())
      .get('/tasks/pending')
      .expect(200);
    const pending = res.body as Task[];
    expect(pending).toHaveLength(1);
    expect(pending[0].title).toBe('Pendiente');
  });

  it('GET /tasks/priority/high devuelve solo tareas de prioridad high', async () => {
    await request(app.getHttpServer())
      .post('/tasks')
      .send({ title: 'Alta', priority: 'high' });
    await request(app.getHttpServer())
      .post('/tasks')
      .send({ title: 'Baja', priority: 'low' });

    const res = await request(app.getHttpServer())
      .get('/tasks/priority/high')
      .expect(200);
    const high = res.body as Task[];
    expect(high).toHaveLength(1);
    expect(high[0].priority).toBe('high');
  });

  it('GET /tasks?completed=false filtra pendientes', async () => {
    await request(app.getHttpServer())
      .post('/tasks')
      .send({ title: 'Solo pendiente', completed: false });

    const res = await request(app.getHttpServer())
      .get('/tasks?completed=false')
      .expect(200);
    const list = res.body as Task[];
    expect(list).toHaveLength(1);
    expect(list[0].completed).toBe(false);
  });

  it('GET /tasks/stats devuelve total, completed y pending', async () => {
    const emptyRes = await request(app.getHttpServer())
      .get('/tasks/stats')
      .expect(200);
    expect(emptyRes.body).toEqual({ total: 0, completed: 0, pending: 0 });

    await request(app.getHttpServer())
      .post('/tasks')
      .send({ title: 'Completada', completed: true });
    await request(app.getHttpServer())
      .post('/tasks')
      .send({ title: 'Pendiente', completed: false });

    const res = await request(app.getHttpServer())
      .get('/tasks/stats')
      .expect(200);
    const stats = res.body as {
      total: number;
      completed: number;
      pending: number;
    };
    expect(stats.total).toBe(2);
    expect(stats.completed).toBe(1);
    expect(stats.pending).toBe(1);
  });

  it('POST /tasks acepta description opcional (máx. 500 caracteres)', async () => {
    const res = await request(app.getHttpServer())
      .post('/tasks')
      .send({ title: 'Con descripción', description: 'Detalle de la tarea' })
      .expect(201);
    const created = res.body as Task;
    expect(created.description).toBe('Detalle de la tarea');
  });

  it('POST /tasks con description > 500 caracteres devuelve 400', () => {
    const longDescription = 'a'.repeat(501);
    return request(app.getHttpServer())
      .post('/tasks')
      .send({ title: 'Ok', description: longDescription })
      .expect(400);
  });
});
