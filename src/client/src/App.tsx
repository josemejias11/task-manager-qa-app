import { useState, useEffect, useCallback, useMemo } from 'react';
import { taskApi } from './services/api';
import { Task, CreateTaskInput } from './types/task';
import { TaskForm } from './components/TaskForm';
import { TaskStats } from './components/TaskStats';
import { TaskItem } from './components/TaskItem';
import { SearchAndFilter, FilterState } from './components/SearchAndFilter';
import { ToastContainer, ToastMessage } from './components/ToastContainer';
import { ToastType } from './components/Toast';
import { ThemeToggle } from './components/theme-toggle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Loader2, Trash2 } from 'lucide-react';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    priority: 'all',
    category: 'all',
    status: 'all',
    sortBy: 'created',
  });

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

  const handleAddTask = async (taskData: CreateTaskInput) => {
    try {
      setError(null);
      const newTask = await taskApi.createTask(taskData);
      setTasks(prev => [newTask, ...prev]);
      showToast(`Task "${taskData.title}" added successfully!`, 'success');
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to add task. Please try again.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      throw err;
    }
  };

  const handleToggleTask = async (id: string, completed: boolean) => {
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
      showToast('Task updated successfully!', 'success');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task.';
      showToast(errorMessage, 'error');
      throw err;
    }
  };

  const handleDeleteTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

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

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks;

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        task =>
          task.title.toLowerCase().includes(searchLower) ||
          task.description?.toLowerCase().includes(searchLower) ||
          task.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(task =>
        filters.status === 'completed' ? task.completed : !task.completed
      );
    }

    // Priority filter
    if (filters.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(task => task.category === filters.category);
    }

    // Sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (filters.sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'priority': {
          const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        case 'created':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return sorted;
  }, [tasks, filters]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold gradient-text">Task Manager Pro</h1>
            <p className="text-muted-foreground mt-1">Organize your life with style</p>
          </div>
          <ThemeToggle />
        </div>

        {/* Stats Dashboard */}
        <TaskStats tasks={tasks} />

        {/* Add Task Form */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Create New Task</CardTitle>
            <CardDescription>Add a new task with details, priority, and deadline</CardDescription>
          </CardHeader>
          <CardContent>
            <TaskForm onSubmit={handleAddTask} error={error} />
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Search & Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <SearchAndFilter
              filters={filters}
              onFilterChange={newFilters => setFilters(prev => ({ ...prev, ...newFilters }))}
            />
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {tasks.length > 0 && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClearCompleted}>
              <Trash2 className="mr-2 h-4 w-4" />
              Clear Completed ({tasks.filter(t => t.completed).length})
            </Button>
            <Button variant="destructive" onClick={handleRemoveAll}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete All Tasks
            </Button>
          </div>
        )}

        {/* Task List */}
        <Card>
          <CardHeader>
            <CardTitle>
              Tasks ({filteredAndSortedTasks.length}
              {filteredAndSortedTasks.length !== tasks.length && ` of ${tasks.length}`})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredAndSortedTasks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  {tasks.length === 0
                    ? '✨ No tasks yet. Create your first task above!'
                    : '🔍 No tasks match your filters. Try adjusting your search.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAndSortedTasks.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={handleToggleTask}
                    onUpdate={handleUpdateTask}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default App;
