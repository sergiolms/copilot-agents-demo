import { Router } from 'express';
import { todoController } from '../controllers/todo.controller.js';

const router = Router();

// GET /api/todos - Get all todos
router.get('/todos', (req, res) => todoController.getAllTodos(req, res));

// GET /api/todos/:id - Get todo by ID
router.get('/todos/:id', (req, res) => todoController.getTodoById(req, res));

// POST /api/todos - Create a new todo
router.post('/todos', (req, res) => todoController.createTodo(req, res));

// PUT /api/todos/:id - Update a todo
router.put('/todos/:id', (req, res) => todoController.updateTodo(req, res));

// DELETE /api/todos/:id - Delete a todo
router.delete('/todos/:id', (req, res) => todoController.deleteTodo(req, res));

export default router;