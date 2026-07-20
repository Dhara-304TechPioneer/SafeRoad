import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { errorHandler, AppError } from './middleware/errorHandler';

import authRoutes from './routes/authRoutes';
import reportRoutes from './routes/reportRoutes';
import uploadRoutes from './routes/uploadRoutes';
import analyticsRoutes from './routes/analyticsRoutes';

// Load environment variables
dotenv.config();

const app: Express = express();

// Global Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:3000',
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan('dev'));

// Static Files Serving
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check endpoint
app.get('/health', (req: Request, res: Response): void => {
  res.status(200).json({
    status: 'OK',
    message: 'SafeRoad Backend Running',
  });
});

// Catch-all for unhandled routes
app.all(/.*/, (req: Request, res: Response, next: NextFunction): void => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Centralized error handling middleware
app.use(errorHandler);

export default app;
