import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodSchema } from 'zod';

type RequestPart = 'body' | 'query' | 'params';

export const validate =
  (schema: ZodSchema, part: RequestPart = 'body') =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync(req[part]);
      req[part] = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: issues,
        });
        return;
      }
      next(error);
    }
  };
