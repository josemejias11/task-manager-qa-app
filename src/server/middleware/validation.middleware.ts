import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const firstError = error.issues[0];
        res.status(400).json({
          error: firstError.message,
        });
        return;
      }
      res.status(400).json({ error: 'Validation failed' });
    }
  };
};

export const validateParams = (schema: ZodSchema, paramName: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.params[paramName]);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const firstError = error.issues[0];
        res.status(400).json({
          error: firstError.message,
        });
        return;
      }
      res.status(400).json({ error: 'Invalid parameter' });
    }
  };
};
