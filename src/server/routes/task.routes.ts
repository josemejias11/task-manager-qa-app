import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { validate, validateParams } from '../middleware/validation.middleware';
import { createTaskSchema, updateTaskSchema, taskIdSchema } from '../types/task.types';

const router = Router();

// GET /api/tasks - Get all tasks
router.get('/', TaskController.getAllTasks);

// POST /api/tasks - Create a new task
router.post('/', validate(createTaskSchema), TaskController.createTask);

// PATCH /api/tasks/:id - Update a task
router.patch(
  '/:id',
  validateParams(taskIdSchema, 'id'),
  validate(updateTaskSchema),
  TaskController.updateTask
);

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', validateParams(taskIdSchema, 'id'), TaskController.deleteTask);

// DELETE /api/tasks - Delete all tasks
router.delete('/', TaskController.deleteAllTasks);

export default router;
