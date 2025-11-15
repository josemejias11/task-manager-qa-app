import { Task, ITask } from '../models/task.model';
import { CreateTaskInput, UpdateTaskInput, TaskResponse } from '../types/task.types';

export class TaskService {
  /**
   * Get all tasks
   */
  static async getAllTasks(): Promise<TaskResponse[]> {
    const tasks = await Task.find().sort({ createdAt: -1 });
    return tasks.map(this.formatTaskResponse);
  }

  /**
   * Create a new task
   */
  static async createTask(data: CreateTaskInput): Promise<TaskResponse> {
    const task = await Task.create({
      title: data.title,
      completed: false,
    });
    return this.formatTaskResponse(task);
  }

  /**
   * Update a task
   */
  static async updateTask(id: string, data: UpdateTaskInput): Promise<TaskResponse | null> {
    const task = await Task.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!task) {
      return null;
    }

    return this.formatTaskResponse(task);
  }

  /**
   * Delete a task
   */
  static async deleteTask(id: string): Promise<boolean> {
    const result = await Task.findByIdAndDelete(id);
    return result !== null;
  }

  /**
   * Delete all tasks
   */
  static async deleteAllTasks(): Promise<void> {
    await Task.deleteMany({});
  }

  /**
   * Format task for API response
   */
  private static formatTaskResponse(task: ITask): TaskResponse {
    return {
      id: (task._id as any).toString(),
      title: task.title,
      completed: task.completed,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    };
  }
}
