import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getTasks, getTaskStats, deleteTask, updateTask } from "../services/taskService";
import { type Task, type TaskStats, type Pagination as PaginationType } from "../types";
import { Plus, LogOut, Moon, Sun, ListTodo, ClipboardList } from "lucide-react";
import { toast } from "react-toastify";
import DashboardStats from "../components/dashboard/DashboardStats";
import DueDateAlerts from "../components/dashboard/DueDateAlerts";
import TaskCard from "../components/tasks/TaskCard";
import TaskForm from "../components/tasks/TaskForm";
import TaskFilters from "../components/tasks/TaskFilters";
import ConfirmModal from "../components/common/ConfirmModal";
import Pagination from "../components/common/Pagination";
import Loading from "../components/common/Loading";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { isDark, toggle } = useTheme();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [pagination, setPagination] = useState<PaginationType>({ total: 0, page: 1, limit: 10, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<TaskStats>({ total: 0, pending: 0, in_progress: 0, completed: 0, overdue: 0 });

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [alertRefreshKey, setAlertRefreshKey] = useState(0);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getTasks({ page, limit: 10, search, status, priority, sort });
      setTasks(result.data);
      setPagination(result.pagination);
    } catch {
      // error handled silently
    } finally {
      setLoading(false);
    }
  }, [search, status, priority, sort, page]);

  const fetchStats = useCallback(async () => {
    try {
      setStats(await getTaskStats());
    } catch {
      // error handled silently
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [fetchTasks, fetchStats]);

  useEffect(() => {
    setPage(1);
  }, [search, status, priority, sort]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteTask(deleteTarget.id);
      toast.success("Task deleted successfully!");
      setDeleteTarget(null);
      fetchTasks();
      fetchStats();
      setAlertRefreshKey((k) => k + 1);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to delete task";
      toast.error(msg);
    } finally {
      setDeleting(false);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingTask(null);
    fetchTasks();
    fetchStats();
    setAlertRefreshKey((k) => k + 1);
  };

  const handleStatusChange = async (task: Task, newStatus: string) => {
    try {
      await updateTask(task.id, { status: newStatus });
      toast.success(`Task marked as ${newStatus}`);
      fetchTasks();
      fetchStats();
      setAlertRefreshKey((k) => k + 1);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to update status";
      toast.error(msg);
    }
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen relative">
      <div className="bg-mesh" />

      {/* Header */}
      <header className="glass-strong sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <ListTodo className="text-white" size={18} />
            </div>
            <h1 className="text-xl font-bold text-text">TaskFlow</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-text-secondary text-sm hidden sm:block">{user?.name}</span>
            <button onClick={toggle} className="p-2 rounded-xl hover:bg-bg-secondary text-text-secondary transition-colors">
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={logout} className="p-2 rounded-xl hover:bg-bg-secondary text-text-secondary transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 relative">
        {/* Welcome Banner */}
        <div className="glass-strong rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 animate-fade-in-up relative overflow-hidden glow-gold">
          <div className="relative z-10">
            <p className="text-text-secondary text-xs sm:text-sm">{greeting()}</p>
            <h2 className="text-lg sm:text-2xl font-bold text-text mt-1">
              Welcome back, <span className="text-primary">{user?.name?.split(" ")[0] || "there"}</span>
            </h2>
            <p className="text-text-secondary text-xs sm:text-sm mt-2">
              {stats.total === 0
                ? "Create your first task to get started!"
                : `You have ${stats.pending} pending and ${stats.overdue > 0 ? `${stats.overdue} overdue` : "0 overdue"} tasks today.`}
            </p>
          </div>
          <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-primary/10 animate-float" />
          <div className="absolute right-16 -bottom-4 w-16 h-16 rounded-full bg-primary/5" />
        </div>

        {/* Stats */}
        <DashboardStats
          stats={stats}
          onStatClick={(filter) => {
            setStatus(filter);
            setPriority("");
            setSort("newest");
          }}
        />

        {/* Due Date Alerts */}
        <DueDateAlerts
          onTaskClick={(task) => { setEditingTask(task); setShowForm(true); }}
          refreshKey={alertRefreshKey}
        />

        {/* Filters + Create Button */}
        <div className="mb-6 space-y-3">
          <TaskFilters
            search={search} status={status} priority={priority} sort={sort}
            onSearchChange={setSearch} onStatusChange={setStatus}
            onPriorityChange={setPriority} onSortChange={setSort}
          />
          <button
            onClick={() => { setEditingTask(null); setShowForm(true); }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover glow-gold active:scale-100"
          >
            <Plus size={18} />
            New Task
          </button>
        </div>

        {/* Task List */}
          {loading ? (
          <Loading />
        ) : tasks.length === 0 ? (
          <div className="glass-strong rounded-2xl text-center py-10 sm:py-16 px-4 sm:px-6 animate-fade-in-up">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-float">
              <ClipboardList className="text-primary" size={32} />
            </div>
            <p className="text-lg font-semibold text-text">No tasks found</p>
            <p className="text-text-secondary text-sm mt-1 mb-6">
              {search || status || priority ? "Try adjusting your filters" : "Create your first task to get started"}
            </p>
            {!search && !status && !priority && (
              <button
                onClick={() => { setEditingTask(null); setShowForm(true); }}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover glow-gold"
              >
                <Plus size={18} />
                Create Task
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task, i) => (
              <div key={task.id} className={`animate-fade-in-up delay-${Math.min(i + 1, 9)}`}>
                <TaskCard
                  task={task}
                  onEdit={(t) => { setEditingTask(t); setShowForm(true); }}
                  onDelete={setDeleteTarget}
                  onStatusChange={handleStatusChange}
                />
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <Pagination
          page={pagination.page} totalPages={pagination.totalPages}
          total={pagination.total} limit={pagination.limit}
          onPageChange={setPage}
        />
      </main>

      {/* Modals */}
      {showForm && (
        <TaskForm task={editingTask} onClose={() => { setShowForm(false); setEditingTask(null); }} onSuccess={handleFormSuccess} />
      )}
      {deleteTarget && (
        <ConfirmModal
          title="Delete Task"
          message={`Are you sure you want to delete "${deleteTarget.title}"?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}
