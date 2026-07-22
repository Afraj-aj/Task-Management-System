import { type Task } from "../../types";
import { Pencil, Trash2, Calendar, Flag } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const priorityConfig = {
  Low: { colors: "bg-green-100 text-green-700", border: "border-l-green-500", glow: "glow-green" },
  Medium: { colors: "bg-yellow-100 text-yellow-700", border: "border-l-yellow-500", glow: "glow-yellow" },
  High: { colors: "bg-red-100 text-red-700", border: "border-l-red-500", glow: "glow-red" },
};

const statusConfig = {
  Pending: { colors: "bg-gray-100 text-gray-700", dot: "bg-gray-400" },
  "In Progress": { colors: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
  Completed: { colors: "bg-green-100 text-green-700", dot: "bg-green-500" },
};

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const pConfig = priorityConfig[task.priority];
  const sConfig = statusConfig[task.status];

  return (
    <div className={`glass rounded-2xl p-5 border-l-4 ${pConfig.border} ${pConfig.glow} animate-fade-in-up`}>
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-text text-base leading-tight flex-1 mr-2">
          {task.title}
        </h3>
        <div className="flex gap-1 opacity-60 hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(task)} className="p-1.5 rounded-lg hover:bg-bg-secondary text-text-secondary transition-colors">
            <Pencil size={15} />
          </button>
          <button onClick={() => onDelete(task)} className="p-1.5 rounded-lg hover:bg-red-100 text-text-secondary hover:text-danger transition-colors">
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-text-secondary text-sm mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${pConfig.colors}`}>
          <Flag size={11} />
          {task.priority}
        </span>
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${sConfig.colors}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${sConfig.dot}`} />
          {task.status}
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-text-secondary">
        <Calendar size={13} />
        <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-text-secondary mt-1">
        <Calendar size={13} />
        <span>Created: {new Date(task.created_at).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
