import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import { todoService } from '../services/todo.service.js';

describe('Todo API Integration Tests', () => {
  beforeEach(async () => {
    await todoService.clearAllTodos();
  });

  describe('POST /api/todos', () => {
    it('should create a new todo', async () => {
      const todoData = { title: 'Test todo' };

      const response = await request(app)
        .post('/api/todos')
        .send(todoData)
        .expect(201);

      expect(response.body.title).toBe('Test todo');
      expect(response.body.done).toBe(false);
      expect(response.body.id).toBeDefined();
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
    });

    it('should return 400 when title is missing', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({})
        .expect(400);

      expect(response.body.error).toBe('Title is required and must be a non-empty string');
    });

    it('should return 400 when title is empty', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({ title: '' })
        .expect(400);

      expect(response.body.error).toBe('Title is required and must be a non-empty string');
    });
  });

  describe('GET /api/todos', () => {
    it('should return empty array when no todos exist', async () => {
      const response = await request(app)
        .get('/api/todos')
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('should return all todos', async () => {
      // Create two todos
      await request(app)
        .post('/api/todos')
        .send({ title: 'Todo 1' });

      await request(app)
        .post('/api/todos')
        .send({ title: 'Todo 2' });

      const response = await request(app)
        .get('/api/todos')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].title).toBe('Todo 1');
      expect(response.body[1].title).toBe('Todo 2');
    });
  });

  describe('GET /api/todos/:id', () => {
    it('should return todo when it exists', async () => {
      const createResponse = await request(app)
        .post('/api/todos')
        .send({ title: 'Test todo' });

      const todoId = createResponse.body.id;

      const response = await request(app)
        .get(`/api/todos/${todoId}`)
        .expect(200);

      expect(response.body.id).toBe(todoId);
      expect(response.body.title).toBe('Test todo');
    });

    it('should return 404 when todo does not exist', async () => {
      const response = await request(app)
        .get('/api/todos/non-existent-id')
        .expect(404);

      expect(response.body.error).toBe('Todo not found');
    });
  });

  describe('PUT /api/todos/:id', () => {
    it('should update todo title', async () => {
      const createResponse = await request(app)
        .post('/api/todos')
        .send({ title: 'Original title' });

      const todoId = createResponse.body.id;

      const response = await request(app)
        .put(`/api/todos/${todoId}`)
        .send({ title: 'Updated title' })
        .expect(200);

      expect(response.body.title).toBe('Updated title');
      expect(response.body.done).toBe(false);
    });

    it('should update todo done status', async () => {
      const createResponse = await request(app)
        .post('/api/todos')
        .send({ title: 'Test todo' });

      const todoId = createResponse.body.id;

      const response = await request(app)
        .put(`/api/todos/${todoId}`)
        .send({ done: true })
        .expect(200);

      expect(response.body.done).toBe(true);
      expect(response.body.title).toBe('Test todo');
    });

    it('should return 404 when todo does not exist', async () => {
      const response = await request(app)
        .put('/api/todos/non-existent-id')
        .send({ title: 'Updated title' })
        .expect(404);

      expect(response.body.error).toBe('Todo not found');
    });

    it('should return 400 when title is empty', async () => {
      const createResponse = await request(app)
        .post('/api/todos')
        .send({ title: 'Test todo' });

      const todoId = createResponse.body.id;

      const response = await request(app)
        .put(`/api/todos/${todoId}`)
        .send({ title: '' })
        .expect(400);

      expect(response.body.error).toBe('Title must be a non-empty string');
    });
  });

  describe('DELETE /api/todos/:id', () => {
    it('should delete existing todo', async () => {
      const createResponse = await request(app)
        .post('/api/todos')
        .send({ title: 'Test todo' });

      const todoId = createResponse.body.id;

      await request(app)
        .delete(`/api/todos/${todoId}`)
        .expect(204);

      // Verify todo is deleted
      await request(app)
        .get(`/api/todos/${todoId}`)
        .expect(404);
    });

    it('should return 404 when todo does not exist', async () => {
      const response = await request(app)
        .delete('/api/todos/non-existent-id')
        .expect(404);

      expect(response.body.error).toBe('Todo not found');
    });
  });
});