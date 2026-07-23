import { type Task } from "../../types";
import { X, Calendar, Flag, Clock, AlertTriangle, Pencil } from "lucide-react";

const priorityConfig = {
  Low: { colors: "bg-green-100 text-green-700", label: "Low" },
  Medium: { colors: "bg-yellow-100 text-yellow-700", label: "Medium" },
  High: { colors: "bg-red-100 text-red-700", label: "High" },
};

const statusConfig = {
  Pending: { colors: "bg-yellow-100 text-yellow-700" },
  "In Progress": { colors: "bg-blue-100 text-blue-700" },
  Completed: { colors: "bg-green-100 text-green-700" },
};

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-");
  return `${m}/${d}/${y}`;
}

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString();
}

interface TaskDetailProps {
  task: Task;
  onClose: () => void;
  onEdit: (task: Task) => void;
}

export default function TaskDetail({ task, onClose, onEdit }: TaskDetailProps) {
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const isOverdue = task.status !== "Completed" && task.due_date < todayStr;
  const pc = priorityConfig[task.priority];
  const sc = statusConfig[task.status];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="glass-strong rounded-2xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border/30">
          <h2 className="text-lg font-bold text-text">Task Details</h2>
          <div className="flex items-center gap-1">
            <button
              onClick={() => { onEdit(task); }}
              className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
              title="Edit task"
            >
              <Pencil size={18} />
            </button>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-bg-secondary text-text-secondary transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-5">
          {/* Title */}
          <div>
            <h3 className="text-xl font-bold text-text">{task.title}</h3>
          </div>

          {/* Status + Priority row */}
          <div className="flex flex-wrap gap-2">
            <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${sc.colors}`}>
              {task.status}
            </span>
            <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${pc.colors}`}>
              <Flag size={11} />
              {pc.label}
            </span>
            {isOverdue && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-red-100 text-red-700">
                <AlertTriangle size={11} />
                Overdue
              </span>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-medium text-text-secondary uppercase tracking-wide">Description</label>
            <p className="mt-1 text-sm text-text whitespace-pre-wrap">
              {task.description || "No description provided."}
            </p>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-text-secondary uppercase tracking-wide flex items-center gap-1">
                <Calendar size={12} /> Due Date
              </label>
              <p className={`mt-1 text-sm font-medium ${isOverdue ? "text-red-600 dark:text-red-400" : "text-text"}`}>
                {formatDate(task.due_date)}
                {isOverdue && " (Overdue)"}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-text-secondary uppercase tracking-wide flex items-center gap-1">
                <Flag size={12} /> Priority
              </label>
              <p className="mt-1 text-sm font-medium text-text">{task.priority}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-text-secondary uppercase tracking-wide flex items-center gap-1">
                <Clock size={12} /> Created
              </label>
              <p className="mt-1 text-sm text-text-secondary">{formatDateTime(task.created_at)}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-text-secondary uppercase tracking-wide flex items-center gap-1">
                <Clock size={12} /> Updated
              </label>
              <p className="mt-1 text-sm text-text-secondary">{formatDateTime(task.updated_at)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
