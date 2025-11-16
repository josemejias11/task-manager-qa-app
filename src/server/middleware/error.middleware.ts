import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Server error:', err);

  // SQLite constraint error
  if (err.message.includes('SQLITE_CONSTRAINT')) {
    res.status(400).json({
      error: 'Database constraint violation',
    });
    return;
  }

  // Default error
  res.status(500).json({
    error: err.message || 'Internal server error',
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
