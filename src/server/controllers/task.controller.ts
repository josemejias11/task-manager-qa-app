import { Request, Response } from 'express';
import { TaskService } from '../services/task.service';
import { asyncHandler } from '../middleware/error.middleware';

export class TaskController {
  /**
   * GET /api/tasks - Get all tasks
   */
  static getAllTasks = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    // Support for testing - force error with header
    if (req.headers['x-force-error'] === 'true') {
      console.warn('Forced error triggered by x-force-error header');
      res.status(500).json({ error: 'Internal server error (forced)' });
      return;
    }

    const tasks = await TaskService.getAllTasks();
    res.json(tasks);
  });

  /**
   * POST /api/tasks - Create a new task
   */
  static createTask = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    // Support for testing - force error with header
    if (req.headers['x-force-error'] === 'true') {
      res.status(500).json({ error: 'Internal server error (forced)' });
      return;
    }

    const task = await TaskService.createTask(req.body);
    res.status(201).json(task);
  });

  /**
   * PATCH /api/tasks/:id - Update a task
   */
  static updateTask = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const task = await TaskService.updateTask(id, req.body);

    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.json(task);
  });

  /**
   * DELETE /api/tasks/:id - Delete a task
   */
  static deleteTask = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const deleted = await TaskService.deleteTask(id);

    if (!deleted) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.status(204).end();
  });

  /**
   * DELETE /api/tasks - Delete all tasks
   */
  static deleteAllTasks = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    await TaskService.deleteAllTasks();
    res.status(204).end();
  });
}
