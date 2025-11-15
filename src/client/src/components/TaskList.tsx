import { Task } from '../types/task';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onUpdate: (id: string, title: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function TaskList({ tasks, onToggle, onUpdate, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state text-center py-5">
        <div className="empty-state-icon">📋</div>
        <h3 className="mt-3">No tasks yet!</h3>
        <p className="text-muted">Add your first task above to get started</p>
        <div className="text-muted mt-3">
          <small>
            <span className="icon-tip">💡</span>
            <strong>Tip:</strong> Use keyboard shortcuts - Enter to add, Escape to cancel edit
          </small>
        </div>
      </div>
    );
  }

  return (
    <ul className="list-group task-list">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
