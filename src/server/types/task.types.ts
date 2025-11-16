import { z } from 'zod';

// Validation schemas
export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required and must be a non-empty string')
    .max(20, 'Task title must be 20 characters or less')
    .transform(val => val.trim()),
});

export const updateTaskSchema = z
  .object({
    title: z
      .string()
      .min(1, 'Title must be a non-empty string')
      .max(20, 'Task title must be 20 characters or less')
      .transform(val => val.trim())
      .optional(),
    completed: z.boolean().optional(),
  })
  .refine(data => data.title !== undefined || data.completed !== undefined, {
    message: 'At least one of completed or title must be provided',
  });

export const taskIdSchema = z
  .string()
  .uuid('Invalid task ID format')
  .or(z.string().min(1, 'Task ID is required'));

// Type exports
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

// Database row type (from SQLite)
export interface TaskRow {
  id: string;
  title: string;
  completed: number; // SQLite stores booleans as 0/1
  created_at: string;
  updated_at: string;
}

// Response types
export interface TaskResponse {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ErrorResponse {
  error: string;
}
