import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select } from './ui/select';
import { TaskCategory, TaskPriority, CreateTaskInput } from '../types/task';

interface TaskFormProps {
  onSubmit: (task: CreateTaskInput) => Promise<void>;
  error: string | null;
}

export function TaskForm({ onSubmit, error }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [category, setCategory] = useState<TaskCategory>('personal');
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      const taskData: CreateTaskInput = {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        category,
        dueDate: dueDate || null,
        tags: tags
          .split(',')
          .map(t => t.trim())
          .filter(t => t.length > 0),
      };

      await onSubmit(taskData);

      // Reset form
      setTitle('');
      setDescription('');
      setPriority('medium');
      setCategory('personal');
      setDueDate('');
      setTags('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Input
            type="text"
            placeholder="Task title (required)"
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={100}
            className="text-base"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <Input
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            maxLength={500}
          />
        </div>

        <Select value={priority} onChange={e => setPriority(e.target.value as TaskPriority)}>
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
          <option value="urgent">Urgent</option>
        </Select>

        <Select value={category} onChange={e => setCategory(e.target.value as TaskCategory)}>
          <option value="personal">Personal</option>
          <option value="work">Work</option>
          <option value="shopping">Shopping</option>
          <option value="health">Health</option>
          <option value="other">Other</option>
        </Select>

        <Input
          type="datetime-local"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
          placeholder="Due date"
        />

        <Input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={e => setTags(e.target.value)}
        />
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
      )}

      <Button type="submit" disabled={!title.trim() || isSubmitting} className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        {isSubmitting ? 'Adding...' : 'Add Task'}
      </Button>
    </form>
  );
}
