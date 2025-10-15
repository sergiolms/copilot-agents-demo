import express, { Request, Response } from 'express';
import todoRoutes from './routes/todo.routes.js';

const app = express();

// Middleware
app.use(express.json());

// Health check route
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ ok: true });
});

// API routes
app.use('/api', todoRoutes);

// App is exported without starting the server
// Server is started in server.ts

export default app;