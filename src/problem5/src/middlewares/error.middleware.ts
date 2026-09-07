import { NextFunction, Request, Response } from 'express';
import { AppError } from '../services/resource.service';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Handle invalid JSON syntax in request body
  if (err instanceof SyntaxError && 'status' in err && err.status === 400) {
    res.status(400).json({
      success: false,
      message: 'Malformed JSON payload in request body',
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Fallback for unhandled server errors
  console.error('Unhandled Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} not found`,
  });
};
