import { useState } from 'react';
import { Trash2, Edit2, Check, X, Calendar, Tag as TagIcon } from 'lucide-react';
import { Task } from '../types/task';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { format } from 'date-fns';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string, completed: boolean) => void;
  onUpdate: (id: string, title: string) => Promise<void>;
  onDelete: (id: string) => void;
}

const priorityColors: Record<string, 'default' | 'warning' | 'destructive' | 'secondary'> = {
  low: 'secondary',
  medium: 'default',
  high: 'warning',
  urgent: 'destructive',
};

const categoryColors: Record<
  string,
  'default' | 'success' | 'info' | 'warning' | 'secondary' | 'destructive'
> = {
  work: 'info',
  personal: 'success',
  shopping: 'warning',
  health: 'destructive',
  other: 'secondary',
};

export function TaskItem({ task, onToggle, onUpdate, onDelete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);

  const handleSave = async () => {
    if (editedTitle.trim() && editedTitle !== task.title) {
      try {
        await onUpdate(task.id, editedTitle);
        setIsEditing(false);
      } catch (_error) {
        setEditedTitle(task.title);
      }
    } else {
      setIsEditing(false);
      setEditedTitle(task.title);
    }
  };

  const handleCancel = () => {
    setEditedTitle(task.title);
    setIsEditing(false);
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <div
      className={`group rounded-lg border bg-card p-4 transition-all hover:shadow-md ${
        task.completed ? 'opacity-60' : ''
      } ${isOverdue ? 'border-destructive/50' : ''}`}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={task.completed}
          onCheckedChange={checked => onToggle(task.id, checked)}
          className="mt-0.5"
        />

        <div className="flex-1 space-y-2">
          {isEditing ? (
            <div className="flex gap-2">
              <Input
                value={editedTitle}
                onChange={e => setEditedTitle(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleSave();
                  if (e.key === 'Escape') handleCancel();
                }}
                className="flex-1"
                autoFocus
              />
              <Button size="icon" variant="ghost" onClick={handleSave}>
                <Check className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={handleCancel}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div>
              <h3
                className={`text-base font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}
              >
                {task.title}
              </h3>
              {task.description && (
                <p className="mt-1 text-sm text-muted-foreground">{task.description}</p>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Badge variant={priorityColors[task.priority]}>{task.priority}</Badge>
            <Badge variant={categoryColors[task.category]}>{task.category}</Badge>

            {task.dueDate && (
              <Badge variant={isOverdue ? 'destructive' : 'outline'} className="gap-1">
                <Calendar className="h-3 w-3" />
                {format(new Date(task.dueDate), 'MMM d, yyyy')}
              </Badge>
            )}

            {task.tags.map(tag => (
              <Badge key={tag} variant="outline" className="gap-1">
                <TagIcon className="h-3 w-3" />
                {tag}
              </Badge>
            ))}
          </div>

          <div className="text-xs text-muted-foreground">
            Created {format(new Date(task.createdAt), 'MMM d, yyyy h:mm a')}
          </div>
        </div>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {!isEditing && (
            <>
              <Button size="icon" variant="ghost" onClick={() => setIsEditing(true)}>
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  if (confirm('Are you sure you want to delete this task?')) {
                    onDelete(task.id);
                  }
                }}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
