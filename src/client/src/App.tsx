import { useState, useEffect, useCallback } from 'react';
import { taskApi } from './services/api';
import { Task } from './types/task';
import { TaskForm } from './components/TaskForm';
import { TaskStats } from './components/TaskStats';
import { ActionButtons } from './components/ActionButtons';
import { TaskList } from './components/TaskList';
import { ToastContainer, ToastMessage } from './components/ToastContainer';
import { ToastType } from './components/Toast';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Toast management
  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(7);
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Load tasks on mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const loadedTasks = await taskApi.getAllTasks();
      setTasks(loadedTasks);
      setError(null);
    } catch (err) {
      console.error('Failed to load tasks:', err);
      showToast('Failed to load tasks. Please refresh the page.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = async (title: string) => {
    try {
      setError(null);
      const newTask = await taskApi.createTask({ title });
      setTasks(prev => [newTask, ...prev]);
      showToast(`Task "${title}" added successfully!`, 'success');
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to add task. Please try again.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      throw err;
    }
  };

  const handleToggleTask = async (id: string, completed: boolean) => {
    // Optimistic update
    setTasks(prev => prev.map(task => (task.id === id ? { ...task, completed } : task)));

    try {
      await taskApi.updateTask(id, { completed });
    } catch (err) {
      console.error('Failed to update task:', err);
      showToast('Failed to update task. Refreshing...', 'error');
      await loadTasks();
    }
  };

  const handleUpdateTask = async (id: string, title: string) => {
    try {
      const updatedTask = await taskApi.updateTask(id, { title });
      setTasks(prev => prev.map(task => (task.id === id ? updatedTask : task)));
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update task.';
      showToast(errorMessage, 'error');
      throw err;
    }
  };

  const handleDeleteTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    // Optimistic update
    setTasks(prev => prev.filter(t => t.id !== id));

    try {
      await taskApi.deleteTask(id);
      showToast(`Task "${task.title}" deleted successfully!`, 'success');
    } catch (err) {
      console.error('Failed to delete task:', err);
      showToast('Failed to delete task. Refreshing...', 'error');
      await loadTasks();
    }
  };

  const handleClearCompleted = async () => {
    const completedTasks = tasks.filter(task => task.completed);

    if (completedTasks.length === 0) {
      showToast('No completed tasks to clear!', 'info');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${completedTasks.length} completed tasks?`)) {
      return;
    }

    try {
      // Delete all completed tasks
      await Promise.all(completedTasks.map(task => taskApi.deleteTask(task.id)));

      setTasks(prev => prev.filter(task => !task.completed));
      showToast(`${completedTasks.length} completed tasks cleared!`, 'success');
    } catch (err) {
      console.error('Failed to clear completed tasks:', err);
      showToast('Failed to clear completed tasks. Refreshing...', 'error');
      await loadTasks();
    }
  };

  const handleRemoveAll = async () => {
    if (!confirm('Are you sure you want to delete all tasks?')) {
      return;
    }

    const taskCount = tasks.length;

    try {
      await taskApi.deleteAllTasks();
      setTasks([]);
      showToast(`All ${taskCount} tasks deleted successfully!`, 'success');
    } catch (err) {
      console.error('Failed to delete all tasks:', err);
      showToast('Failed to delete all tasks. Refreshing...', 'error');
      await loadTasks();
    }
  };

  // Calculate stats
  const completedCount = tasks.filter(task => task.completed).length;
  const activeCount = tasks.length - completedCount;

  if (isLoading) {
    return (
      <div className="app-container">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <TaskStats
        activeCount={activeCount}
        completedCount={completedCount}
        totalCount={tasks.length}
      />

      <TaskForm onSubmit={handleAddTask} error={error} />

      <ActionButtons
        completedCount={completedCount}
        onClearCompleted={handleClearCompleted}
        onRemoveAll={handleRemoveAll}
      />

      <TaskList
        tasks={tasks}
        onToggle={handleToggleTask}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default App;
