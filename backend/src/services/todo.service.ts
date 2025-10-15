import { Todo } from '../types/todo.js';
import { CreateTodoDto, UpdateTodoDto, TodoResponseDto } from '../dto/todo.dto.js';
import { v4 as uuidv4 } from 'uuid';

class TodoService {
  private todos: Todo[] = [];

  async getAllTodos(): Promise<TodoResponseDto[]> {
    return this.todos.map(this.mapToResponseDto);
  }

  async getTodoById(id: string): Promise<TodoResponseDto | null> {
    const todo = this.todos.find(t => t.id === id);
    return todo ? this.mapToResponseDto(todo) : null;
  }

  async createTodo(createDto: CreateTodoDto): Promise<TodoResponseDto> {
    const now = new Date();
    const todo: Todo = {
      id: uuidv4(),
      title: createDto.title,
      done: false,
      createdAt: now,
      updatedAt: now
    };

    this.todos.push(todo);
    return this.mapToResponseDto(todo);
  }

  async updateTodo(id: string, updateDto: UpdateTodoDto): Promise<TodoResponseDto | null> {
    const todoIndex = this.todos.findIndex(t => t.id === id);
    if (todoIndex === -1) {
      return null;
    }

    const existingTodo = this.todos[todoIndex];
    const updatedTodo: Todo = {
      ...existingTodo,
      ...updateDto,
      updatedAt: new Date()
    };

    this.todos[todoIndex] = updatedTodo;
    return this.mapToResponseDto(updatedTodo);
  }

  async deleteTodo(id: string): Promise<boolean> {
    const todoIndex = this.todos.findIndex(t => t.id === id);
    if (todoIndex === -1) {
      return false;
    }

    this.todos.splice(todoIndex, 1);
    return true;
  }

  private mapToResponseDto(todo: Todo): TodoResponseDto {
    return {
      id: todo.id,
      title: todo.title,
      done: todo.done,
      createdAt: todo.createdAt.toISOString(),
      updatedAt: todo.updatedAt.toISOString()
    };
  }

  // Method for testing - clear all todos
  async clearAllTodos(): Promise<void> {
    this.todos = [];
  }
}

export const todoService = new TodoService();