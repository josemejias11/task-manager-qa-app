import { useState, FormEvent } from 'react';

interface TaskFormProps {
  onSubmit: (title: string) => Promise<void>;
  error: string | null;
}

export function TaskForm({ onSubmit, error }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(title.trim());
      setTitle('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="mb-3">
        <label htmlFor="task-input" className="visually-hidden">
          New Task
        </label>
        <div className="input-group input-group-lg">
          <span className="input-group-text">+</span>
          <input
            type="text"
            id="task-input"
            placeholder="What needs to be done?"
            className="form-control"
            value={title}
            onChange={e => setTitle(e.target.value)}
            disabled={isSubmitting}
            maxLength={20}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting || !title.trim()}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Adding...
              </>
            ) : (
              <>
                <span className="icon-plus">+</span> Add Task
              </>
            )}
          </button>
        </div>
        <div className="form-text text-muted mt-1">
          <small>
            <span className="icon-info">ℹ</span> Press Enter to add task (max 20 characters)
          </small>
        </div>
      </form>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <span className="icon-warning">⚠</span> {error}
        </div>
      )}
    </>
  );
}
