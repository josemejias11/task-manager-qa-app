import { z } from 'zod';

// Enums
const TaskPriorityEnum = z.enum(['low', 'medium', 'high', 'urgent']);
const TaskCategoryEnum = z.enum(['work', 'personal', 'shopping', 'health', 'other']);

export type TaskPriority = z.infer<typeof TaskPriorityEnum>;
export type TaskCategory = z.infer<typeof TaskCategoryEnum>;

// Validation schemas
export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required and must be a non-empty string')
    .max(100, 'Task title must be 100 characters or less')
    .transform(val => val.trim()),
  description: z.string().max(500, 'Description must be 500 characters or less').optional(),
  priority: TaskPriorityEnum.default('medium'),
  category: TaskCategoryEnum.default('personal'),
  dueDate: z.string().datetime().optional().nullable(),
  tags: z.array(z.string()).default([]),
});

export const updateTaskSchema = z
  .object({
    title: z
      .string()
      .min(1, 'Title must be a non-empty string')
      .max(100, 'Task title must be 100 characters or less')
      .transform(val => val.trim())
      .optional(),
    description: z
      .string()
      .max(500, 'Description must be 500 characters or less')
      .optional()
      .nullable(),
    completed: z.boolean().optional(),
    priority: TaskPriorityEnum.optional(),
    category: TaskCategoryEnum.optional(),
    dueDate: z.string().datetime().optional().nullable(),
    tags: z.array(z.string()).optional(),
  })
  .refine(
    data =>
      data.title !== undefined ||
      data.completed !== undefined ||
      data.priority !== undefined ||
      data.category !== undefined ||
      data.dueDate !== undefined ||
      data.description !== undefined ||
      data.tags !== undefined,
    {
      message: 'At least one field must be provided for update',
    }
  );

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
  description: string | null;
  completed: number; // SQLite stores booleans as 0/1
  priority: TaskPriority;
  category: TaskCategory;
  due_date: string | null;
  tags: string | null; // Stored as JSON string
  created_at: string;
  updated_at: string;
}

// Response types
export interface TaskResponse {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  priority: TaskPriority;
  category: TaskCategory;
  dueDate: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ErrorResponse {
  error: string;
}
