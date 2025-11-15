import { useState, FormEvent, KeyboardEvent } from 'react';
import { Task } from '../types/task';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onUpdate: (id: string, title: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function TaskItem({ task, onToggle, onUpdate, onDelete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [showNotification, setShowNotification] = useState(false);

  const handleToggle = async () => {
    await onToggle(task.id, !task.completed);
  };

  const handleEdit = () => {
    setEditTitle(task.title);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setIsEditing(false);
  };

  const handleSave = async (e?: FormEvent) => {
    e?.preventDefault();

    const trimmedTitle = editTitle.trim();
    if (!trimmedTitle) {
      alert('Task title cannot be empty.');
      return;
    }

    if (trimmedTitle.length > 20) {
      alert('Task title must be 20 characters or less.');
      return;
    }

    try {
      await onUpdate(task.id, trimmedTitle);
      setIsEditing(false);

      // Show notification
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } catch (error) {
      alert('Failed to update task. Please try again.');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleDelete = async () => {
    await onDelete(task.id);
  };

  return (
    <li className="list-group-item d-flex justify-content-between align-items-center task-item">
      <div className="d-flex align-items-center flex-grow-1">
        {isEditing ? (
          <form onSubmit={handleSave} className="d-flex align-items-center flex-grow-1">
            <input
              type="text"
              className="form-control edit-input"
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              maxLength={20}
            />
            <button type="submit" className="btn btn-sm btn-success me-1">
              <span className="icon-save">✓</span> Save
            </button>
            <button type="button" className="btn btn-sm btn-secondary" onClick={handleCancel}>
              <span className="icon-cancel">✗</span> Cancel
            </button>
          </form>
        ) : (
          <>
            <input
              type="checkbox"
              className="form-check-input me-2"
              checked={task.completed}
              onChange={handleToggle}
              aria-label={`Mark task "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
            />
            <span className={`task-title ${task.completed ? 'task-completed' : ''}`}>
              {task.title}
            </span>
            {showNotification && <span className="update-notification show">Updated!</span>}
          </>
        )}
      </div>

      {!isEditing && (
        <div className="btn-group-task">
          <button
            className="btn btn-sm btn-secondary"
            onClick={handleEdit}
            aria-label={`Edit task ${task.title}`}
          >
            <span className="icon-edit">✎</span> Edit
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={handleDelete}
            aria-label={`Delete task ${task.title}`}
          >
            <span className="icon-delete">✗</span> Delete
          </button>
        </div>
      )}
    </li>
  );
}
