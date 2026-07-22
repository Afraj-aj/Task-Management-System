import { useState, useEffect } from "react";
import { type Task } from "../../types";
import api from "../../api/axios";
import { X } from "lucide-react";
import { toast } from "react-toastify";

interface TaskFormProps {
  task: Task | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function TaskForm({ task, onClose, onSuccess }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High" | "">("");
  const [status, setStatus] = useState<"Pending" | "In Progress" | "Completed">("Pending");
  const [dueDate, setDueDate] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const isEditing = !!task;
  const isCompleted = task?.status === "Completed";

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setPriority(task.priority);
      setStatus(task.status);
      setDueDate(task.due_date.split("T")[0]);
    }
  }, [task]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!priority) newErrors.priority = "Priority is required";
    if (!dueDate && !isCompleted) newErrors.due_date = "Due date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError("");

    try {
      const payload: Record<string, unknown> = {
        title: title.trim(),
        description: description.trim() || null,
        priority,
        status,
      };

      if (!isCompleted) {
        payload.due_date = dueDate;
      }

      if (isEditing) {
        await api.put(`/tasks/${task.id}`, payload);
        toast.success("Task updated successfully!");
      } else {
        await api.post("/tasks", payload);
        toast.success("Task created successfully!");
      }

      onSuccess();
    } catch (err: any) {
      const msg = err.response?.data?.message || "Something went wrong";
      setServerError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="glass-strong rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in-up">
        <div className="flex items-center justify-between p-5 border-b border-border/30">
          <h2 className="text-lg font-bold text-text">{isEditing ? "Edit Task" : "Create Task"}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-bg-secondary text-text-secondary transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {serverError && (
            <div className="bg-danger/10 text-danger p-3 rounded-xl text-sm">{serverError}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-text mb-1">Title *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border text-text focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter task title" />
            {errors.title && <p className="text-danger text-xs mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border text-text focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={3} placeholder="Enter task description" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1">Priority *</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl border text-text focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">Select</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              {errors.priority && <p className="text-danger text-xs mt-1">{errors.priority}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-1">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as any)}
                disabled={isCompleted}
                className="w-full px-4 py-2.5 rounded-xl border text-text focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50">
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1">Due Date *</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
              disabled={isCompleted}
              className="w-full px-4 py-2.5 rounded-xl border text-text focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50" />
            {errors.due_date && <p className="text-danger text-xs mt-1">{errors.due_date}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 border border-border rounded-xl text-text-secondary hover:bg-bg-secondary transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              className="flex-1 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-all disabled:opacity-50 glow-gold">
              {submitting ? "Saving..." : isEditing ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
