import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
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
});
