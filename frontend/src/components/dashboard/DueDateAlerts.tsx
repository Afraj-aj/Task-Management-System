import { useState, useEffect, useCallback } from "react";
import { type Task } from "../../types";
import { getDueSoonTasks } from "../../services/taskService";
import { Clock, ChevronRight, X } from "lucide-react";

function getTimeLeft(dueDate: string): string {
  const diffMs = new Date(dueDate).getTime() - Date.now();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffMins < 60) return `${diffMins}m left`;
  if (diffHours < 24) return `${diffHours}h left`;
  return "Tomorrow";
}

interface DueDateAlertsProps {
  onTaskClick?: (task: Task) => void;
  refreshKey?: number;
}

export default function DueDateAlerts({ onTaskClick, refreshKey }: DueDateAlertsProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dismissed, setDismissed] = useState(false);

  const fetchDueSoon = useCallback(async () => {
    try {
      const all = await getDueSoonTasks();
      // Filter out overdue tasks (due_date before today)
      const today = new Date(new Date().toDateString());
      const filtered = all.filter(
        (t: Task) => new Date(t.due_date) >= today
      );
      setTasks(filtered);
      setDismissed(false);
    } catch {
      // error handled silently
    }
  }, []);

  useEffect(() => {
    fetchDueSoon();
    const interval = setInterval(fetchDueSoon, 60000);
    return () => clearInterval(interval);
  }, [fetchDueSoon, refreshKey]);

  if (tasks.length === 0 || dismissed) return null;

  return (
    <div className="mb-6 animate-fade-in-up">
      <div className="rounded-2xl border border-primary/30 dark:border-primary/20 bg-primary/5 dark:bg-primary/10 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
              <Clock className="text-primary" size={16} />
            </div>
            <h3 className="text-sm font-semibold text-primary">
              Due within 1 day ({tasks.length})
            </h3>
          </div>
          <button onClick={() => setDismissed(true)} className="p-1 rounded-lg hover:bg-primary/10 text-text-secondary transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="space-y-2">
          {tasks.map((task) => (
            <button
              key={task.id}
              onClick={() => onTaskClick?.(task)}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-white/50 dark:bg-white/10 hover:bg-primary/10 transition-colors text-left group"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text truncate">{task.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-medium text-primary">{getTimeLeft(task.due_date)}</span>
                  <span className="text-xs text-text-secondary">• {task.priority}</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-primary/40 group-hover:text-primary transition-colors shrink-0 ml-2" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
