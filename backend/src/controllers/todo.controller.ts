import { Request, Response } from 'express';
import { todoService } from '../services/todo.service.js';
import { validateCreateTodoDto, validateUpdateTodoDto } from '../dto/todo.dto.js';

export class TodoController {
  async getAllTodos(req: Request, res: Response): Promise<void> {
    try {
      const todos = await todoService.getAllTodos();
      res.json(todos);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getTodoById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const todo = await todoService.getTodoById(id);
      
      if (!todo) {
        res.status(404).json({ error: 'Todo not found' });
        return;
      }

      res.json(todo);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async createTodo(req: Request, res: Response): Promise<void> {
    try {
      const createDto = validateCreateTodoDto(req.body);
      const todo = await todoService.createTodo(createDto);
      res.status(201).json(todo);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateTodo(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateDto = validateUpdateTodoDto(req.body);
      
      const todo = await todoService.updateTodo(id, updateDto);
      
      if (!todo) {
        res.status(404).json({ error: 'Todo not found' });
        return;
      }

      res.json(todo);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deleteTodo(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await todoService.deleteTodo(id);
      
      if (!deleted) {
        res.status(404).json({ error: 'Todo not found' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const todoController = new TodoController();