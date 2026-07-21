export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Task {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  priority: "Low" | "Medium" | "High";
  status: "Pending" | "In Progress" | "Completed";
  due_date: string;
  created_at: string;
  updated_at: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: Pagination;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface TaskFilters {
  search?: string;
  status?: string;
  priority?: string;
  sort?: string;
  page?: number;
  limit?: number;
}
