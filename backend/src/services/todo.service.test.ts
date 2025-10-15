import { describe, it, expect, beforeEach } from 'vitest';
import { todoService } from '../services/todo.service.js';
import { CreateTodoDto, UpdateTodoDto } from '../dto/todo.dto.js';

describe('TodoService', () => {
  beforeEach(async () => {
    await todoService.clearAllTodos();
  });

  describe('createTodo', () => {
    it('should create a new todo', async () => {
      const createDto: CreateTodoDto = { title: 'Test todo' };
      const todo = await todoService.createTodo(createDto);

      expect(todo.title).toBe('Test todo');
      expect(todo.done).toBe(false);
      expect(todo.id).toBeDefined();
      expect(todo.createdAt).toBeDefined();
      expect(todo.updatedAt).toBeDefined();
    });
  });

  describe('getAllTodos', () => {
    it('should return empty array when no todos exist', async () => {
      const todos = await todoService.getAllTodos();
      expect(todos).toEqual([]);
    });

    it('should return all todos', async () => {
      const createDto1: CreateTodoDto = { title: 'Todo 1' };
      const createDto2: CreateTodoDto = { title: 'Todo 2' };

      await todoService.createTodo(createDto1);
      await todoService.createTodo(createDto2);

      const todos = await todoService.getAllTodos();
      expect(todos).toHaveLength(2);
      expect(todos[0].title).toBe('Todo 1');
      expect(todos[1].title).toBe('Todo 2');
    });
  });

  describe('getTodoById', () => {
    it('should return todo when it exists', async () => {
      const createDto: CreateTodoDto = { title: 'Test todo' };
      const createdTodo = await todoService.createTodo(createDto);

      const todo = await todoService.getTodoById(createdTodo.id);
      expect(todo).not.toBeNull();
      expect(todo!.id).toBe(createdTodo.id);
      expect(todo!.title).toBe('Test todo');
    });

    it('should return null when todo does not exist', async () => {
      const todo = await todoService.getTodoById('non-existent-id');
      expect(todo).toBeNull();
    });
  });

  describe('updateTodo', () => {
    it('should update todo title', async () => {
      const createDto: CreateTodoDto = { title: 'Original title' };
      const createdTodo = await todoService.createTodo(createDto);

      const updateDto: UpdateTodoDto = { title: 'Updated title' };
      const updatedTodo = await todoService.updateTodo(createdTodo.id, updateDto);

      expect(updatedTodo).not.toBeNull();
      expect(updatedTodo!.title).toBe('Updated title');
      expect(updatedTodo!.done).toBe(false);
    });

    it('should update todo done status', async () => {
      const createDto: CreateTodoDto = { title: 'Test todo' };
      const createdTodo = await todoService.createTodo(createDto);

      const updateDto: UpdateTodoDto = { done: true };
      const updatedTodo = await todoService.updateTodo(createdTodo.id, updateDto);

      expect(updatedTodo).not.toBeNull();
      expect(updatedTodo!.done).toBe(true);
      expect(updatedTodo!.title).toBe('Test todo');
    });

    it('should return null when todo does not exist', async () => {
      const updateDto: UpdateTodoDto = { title: 'Updated title' };
      const result = await todoService.updateTodo('non-existent-id', updateDto);
      expect(result).toBeNull();
    });
  });

  describe('deleteTodo', () => {
    it('should delete existing todo', async () => {
      const createDto: CreateTodoDto = { title: 'Test todo' };
      const createdTodo = await todoService.createTodo(createDto);

      const deleted = await todoService.deleteTodo(createdTodo.id);
      expect(deleted).toBe(true);

      const todo = await todoService.getTodoById(createdTodo.id);
      expect(todo).toBeNull();
    });

    it('should return false when todo does not exist', async () => {
      const deleted = await todoService.deleteTodo('non-existent-id');
      expect(deleted).toBe(false);
    });
  });
});