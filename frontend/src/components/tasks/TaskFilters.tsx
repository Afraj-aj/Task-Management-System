import { Search } from "lucide-react";

interface TaskFiltersProps {
  search: string;
  status: string;
  priority: string;
  sort: string;
  onSearchChange: (val: string) => void;
  onStatusChange: (val: string) => void;
  onPriorityChange: (val: string) => void;
  onSortChange: (val: string) => void;
}

export default function TaskFilters({
  search, status, priority, sort,
  onSearchChange, onStatusChange, onPriorityChange, onSortChange,
}: TaskFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl glass text-text focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <select value={status} onChange={(e) => onStatusChange(e.target.value)}
        className="px-4 py-2.5 rounded-xl glass text-text focus:outline-none focus:ring-2 focus:ring-primary">
        <option value="">All Status</option>
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>

      <select value={priority} onChange={(e) => onPriorityChange(e.target.value)}
        className="px-4 py-2.5 rounded-xl glass text-text focus:outline-none focus:ring-2 focus:ring-primary">
        <option value="">All Priority</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <select value={sort} onChange={(e) => onSortChange(e.target.value)}
        className="px-4 py-2.5 rounded-xl glass text-text focus:outline-none focus:ring-2 focus:ring-primary">
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="due_date">Due Date</option>
      </select>
    </div>
  );
}
