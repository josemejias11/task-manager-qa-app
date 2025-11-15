import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Server error:', err);

  // Mongoose validation error
  if (err instanceof MongooseError.ValidationError) {
    const firstError = Object.values(err.errors)[0];
    res.status(400).json({
      error: firstError.message,
    });
    return;
  }

  // Mongoose cast error (invalid ID format)
  if (err instanceof MongooseError.CastError) {
    res.status(400).json({
      error: 'Invalid ID format',
    });
    return;
  }

  // Default error
  res.status(500).json({
    error: 'Internal server error',
  });
};

// Async error wrapper
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
