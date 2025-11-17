import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { Select } from './ui/select';
import { TaskCategory, TaskPriority } from '../types/task';

export interface FilterState {
  search: string;
  priority: TaskPriority | 'all';
  category: TaskCategory | 'all';
  status: 'all' | 'active' | 'completed';
  sortBy: 'created' | 'dueDate' | 'priority' | 'title';
}

interface SearchAndFilterProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
}

export function SearchAndFilter({ filters, onFilterChange }: SearchAndFilterProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search tasks..."
          value={filters.search}
          onChange={e => onFilterChange({ search: e.target.value })}
          className="pl-10"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        <Select
          value={filters.status}
          onChange={e => onFilterChange({ status: e.target.value as FilterState['status'] })}
        >
          <option value="all">All Tasks</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </Select>

        <Select
          value={filters.priority}
          onChange={e => onFilterChange({ priority: e.target.value as FilterState['priority'] })}
        >
          <option value="all">All Priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </Select>

        <Select
          value={filters.category}
          onChange={e => onFilterChange({ category: e.target.value as FilterState['category'] })}
        >
          <option value="all">All Categories</option>
          <option value="work">Work</option>
          <option value="personal">Personal</option>
          <option value="shopping">Shopping</option>
          <option value="health">Health</option>
          <option value="other">Other</option>
        </Select>

        <Select
          value={filters.sortBy}
          onChange={e => onFilterChange({ sortBy: e.target.value as FilterState['sortBy'] })}
        >
          <option value="created">Sort by Created</option>
          <option value="dueDate">Sort by Due Date</option>
          <option value="priority">Sort by Priority</option>
          <option value="title">Sort by Title</option>
        </Select>
      </div>
    </div>
  );
}
