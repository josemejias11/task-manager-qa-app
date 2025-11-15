import { Task, CreateTaskInput, UpdateTaskInput, ErrorResponse } from '../types/task';

const API_BASE = '/api';

class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `API request failed: ${response.status} ${response.statusText}`;

    try {
      const errorData: ErrorResponse = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch {
      // If JSON parsing fails, use default error message
    }

    throw new ApiError(errorMessage, response.status);
  }

  // For 204 No Content, return null
  if (response.status === 204) {
    return null as T;
  }

  return await response.json();
}

async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });

  return handleResponse<T>(response);
}

export const taskApi = {
  /**
   * Get all tasks
   */
  getAllTasks: (): Promise<Task[]> => {
    return apiRequest<Task[]>('/tasks');
  },

  /**
   * Create a new task
   */
  createTask: (data: CreateTaskInput): Promise<Task> => {
    return apiRequest<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update a task
   */
  updateTask: (id: string, data: UpdateTaskInput): Promise<Task> => {
    return apiRequest<Task>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete a task
   */
  deleteTask: (id: string): Promise<null> => {
    return apiRequest<null>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Delete all tasks
   */
  deleteAllTasks: (): Promise<null> => {
    return apiRequest<null>('/tasks', {
      method: 'DELETE',
    });
  },
};
