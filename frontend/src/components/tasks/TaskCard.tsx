import { type Task } from "../../types";
import { Pencil, Trash2, Calendar, Flag, AlertTriangle } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task, newStatus: string) => void;
}

const priorityConfig = {
  Low: { colors: "bg-green-100 text-green-700", border: "border-l-green-500" },
  Medium: { colors: "bg-yellow-100 text-yellow-700", border: "border-l-yellow-500" },
  High: { colors: "bg-red-100 text-red-700", border: "border-l-red-500" },
};

const statusOptions = ["Pending", "In Progress", "Completed"] as const;

function getDueDateStyle(dueDate: string, status: string) {
  if (status === "Completed") return "text-text-secondary";
  const now = new Date();
  const due = new Date(dueDate);
  const today = new Date(now.toDateString());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  if (due < today) return "text-red-600 dark:text-red-400 font-medium";
  if (due.getTime() === today.getTime()) return "text-orange-600 dark:text-orange-400 font-medium";
  if (due < nextWeek) return "text-yellow-600 dark:text-yellow-400";
  return "text-text-secondary";
}

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const pConfig = priorityConfig[task.priority];
  const isOverdue = task.status !== "Completed" && new Date(task.due_date) < new Date(new Date().toDateString());
  const dueDateStyle = getDueDateStyle(task.due_date, task.status);

  return (
    <div className={`glass rounded-2xl p-3 sm:p-5 border-l-4 ${pConfig.border} animate-fade-in-up ${isOverdue ? "ring-1 ring-red-300 dark:ring-red-800" : ""}`}>
      <div className="flex items-start justify-between mb-2 sm:mb-3">
        <h3 className="font-semibold text-text text-sm sm:text-base leading-tight flex-1 mr-2">
          {isOverdue && <AlertTriangle size={14} className="inline mr-1 text-red-500" />}
          {task.title}
        </h3>
        <div className="flex gap-0.5 opacity-60 hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(task)} className="p-2 sm:p-1.5 rounded-lg hover:bg-bg-secondary text-text-secondary transition-colors">
            <Pencil size={16} />
          </button>
          <button onClick={() => onDelete(task)} className="p-2 sm:p-1.5 rounded-lg hover:bg-red-100 text-text-secondary hover:text-danger transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-text-secondary text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3">
        <span className={`inline-flex items-center gap-1 text-[11px] sm:text-xs font-medium px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full ${pConfig.colors}`}>
          <Flag size={11} />
          {task.priority}
        </span>
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task, e.target.value)}
          className={`text-[11px] sm:text-xs font-medium px-2 sm:px-2 py-0.5 sm:py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 ${
            task.status === "Completed"
              ? "bg-green-100 text-green-700"
              : task.status === "In Progress"
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {statusOptions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className={`flex items-center gap-1.5 text-[11px] sm:text-xs ${dueDateStyle}`}>
        <Calendar size={12} />
        <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
        {isOverdue && <span className="ml-1 text-red-500 font-medium">(Overdue)</span>}
      </div>

      <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-text-secondary mt-1">
        <Calendar size={12} />
        <span>Created: {new Date(task.created_at).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
