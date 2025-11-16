import { db } from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskInput, UpdateTaskInput, TaskResponse, TaskRow } from '../types/task.types';

export class TaskService {
  /**
   * Get all tasks
   */
  static getAllTasks(): TaskResponse[] {
    const stmt = db.prepare('SELECT * FROM tasks ORDER BY created_at DESC');
    const tasks = stmt.all() as TaskRow[];
    return tasks.map(this.formatTaskResponse);
  }

  /**
   * Create a new task
   */
  static createTask(data: CreateTaskInput): TaskResponse {
    const id = uuidv4();
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO tasks (id, title, completed, created_at, updated_at)
      VALUES (?, ?, 0, ?, ?)
    `);

    stmt.run(id, data.title, now, now);

    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) as TaskRow;
    return this.formatTaskResponse(task);
  }

  /**
   * Update a task
   */
  static updateTask(id: string, data: UpdateTaskInput): TaskResponse | null {
    // First check if task exists
    const existingTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) as
      | TaskRow
      | undefined;

    if (!existingTask) {
      return null;
    }

    const now = new Date().toISOString();
    const updates: string[] = [];
    const values: (string | number)[] = [];

    if (data.title !== undefined) {
      updates.push('title = ?');
      values.push(data.title);
    }

    if (data.completed !== undefined) {
      updates.push('completed = ?');
      values.push(data.completed ? 1 : 0);
    }

    updates.push('updated_at = ?');
    values.push(now);

    values.push(id);

    const stmt = db.prepare(`
      UPDATE tasks
      SET ${updates.join(', ')}
      WHERE id = ?
    `);

    stmt.run(...values);

    const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) as TaskRow;
    return this.formatTaskResponse(updatedTask);
  }

  /**
   * Delete a task
   */
  static deleteTask(id: string): boolean {
    const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  /**
   * Delete all tasks
   */
  static deleteAllTasks(): void {
    const stmt = db.prepare('DELETE FROM tasks');
    stmt.run();
  }

  /**
   * Format task for API response
   */
  private static formatTaskResponse(task: TaskRow): TaskResponse {
    return {
      id: task.id,
      title: task.title,
      completed: task.completed === 1,
      createdAt: task.created_at,
      updatedAt: task.updated_at,
    };
  }
}
