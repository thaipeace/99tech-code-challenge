import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';
import resourceRoutes from './routes/resource.routes';

export function createApp(): Application {
  const app: Application = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check endpoint
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // Welcome / API summary endpoint
  app.get('/', (_req: Request, res: Response) => {
    res.status(200).json({
      name: 'Problem 5 - Express TypeScript CRUD Service',
      version: '1.0.0',
      description: 'A robust CRUD backend service with SQLite persistence',
      endpoints: {
        health: 'GET /health',
        createResource: 'POST /api/resources',
        listResources: 'GET /api/resources',
        getResource: 'GET /api/resources/:id',
        updateResource: 'PUT /api/resources/:id or PATCH /api/resources/:id',
        deleteResource: 'DELETE /api/resources/:id',
      },
    });
  });

  // Resource routes
  app.use('/api/resources', resourceRoutes);

  // 404 & Error handlers
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
