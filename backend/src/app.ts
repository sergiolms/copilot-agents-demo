import express, { Request, Response } from 'express';
import cors from 'cors';
import todoRoutes from './routes/todo.routes.js';

const app = express();

// Middleware
app.use(express.json());

// CORS configuration
// Allow explicit origin via FRONTEND_ORIGIN (comma-separated for multiple) or default to '*'
const origins = process.env.FRONTEND_ORIGIN?.split(',').map(o => o.trim()).filter(Boolean);
app.use(cors({
  origin: origins && origins.length > 0 ? origins : '*',
  credentials: false
}));

// Handle preflight for all routes
app.options('*', cors({
  origin: origins && origins.length > 0 ? origins : '*',
  credentials: false
}));

// Health check route
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ ok: true });
});

// API routes
app.use('/api', todoRoutes);

// App is exported without starting the server
// Server is started in server.ts

export default app;