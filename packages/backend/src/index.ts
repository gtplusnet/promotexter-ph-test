import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes';
import { errorHandler } from './middlewares/error.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Request logging
app.use((req, _res, next) => {
  const query = Object.keys(req.query).length > 0 ? `?${new URLSearchParams(req.query as Record<string, string>)}` : '';
  console.log(`\n[${new Date().toISOString()}] ${req.method} ${req.path}${query}`);
  next();
});

// Health check / root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Promotexter Backend API' });
});

// API Routes
app.use('/api/users', userRoutes);

// Global error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
