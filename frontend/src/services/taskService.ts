import api from "../api/axios";
import type { Task, Pagination, TaskStats, TaskFilters } from "../types";

interface TasksResponse {
  data: Task[];
  pagination: Pagination;
}

export async function getTasks(filters: TaskFilters = {}): Promise<TasksResponse> {
  const params: Record<string, string | number> = {};
  if (filters.search) params.search = filters.search;
  if (filters.status) params.status = filters.status;
  if (filters.priority) params.priority = filters.priority;
  if (filters.sort) params.sort = filters.sort;
  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;
  if (filters.overdue) params.overdue = filters.overdue;

  const response = await api.get("/tasks", { params });
  return { data: response.data.data, pagination: response.data.pagination };
}

export async function getTaskStats(): Promise<TaskStats> {
  const response = await api.get("/tasks/stats");
  return response.data.data;
}

export async function getDueSoonTasks(): Promise<Task[]> {
  const response = await api.get("/tasks/due-soon");
  return response.data.data;
}

export async function createTask(payload: {
  title: string;
  description?: string | null;
  priority: string;
  status: string;
  due_date?: string;
}): Promise<Task> {
  const response = await api.post("/tasks", payload);
  return response.data.data;
}

export async function updateTask(
  id: number,
  payload: {
    title?: string;
    description?: string | null;
    priority?: string;
    status?: string;
    due_date?: string;
  }
): Promise<Task> {
  const response = await api.put(`/tasks/${id}`, payload);
  return response.data.data;
}

export async function deleteTask(id: number): Promise<void> {
  await api.delete(`/tasks/${id}`);
}
