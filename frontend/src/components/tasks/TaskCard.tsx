import { Task } from "../../types";
import { Pencil, Trash2, Calendar } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const priorityColors = {
  Low: "bg-green-100 text-green-700",
  Medium: "bg-yellow-100 text-yellow-700",
  High: "bg-red-100 text-red-700",
};

const statusColors = {
  Pending: "bg-gray-100 text-gray-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Completed: "bg-green-100 text-green-700",
};

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  return (
    <div className="bg-surface rounded-xl border border-border p-5 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-text text-base leading-tight flex-1 mr-2">
          {task.title}
        </h3>
        <div className="flex gap-1">
          <button onClick={() => onEdit(task)} className="p-1.5 rounded-lg hover:bg-bg-secondary text-text-secondary transition-colors">
            <Pencil size={16} />
          </button>
          <button onClick={() => onDelete(task)} className="p-1.5 rounded-lg hover:bg-red-50 text-text-secondary hover:text-danger transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-text-secondary text-sm mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[task.status]}`}>
          {task.status}
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-text-secondary">
        <Calendar size={14} />
        <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
