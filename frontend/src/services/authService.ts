import api from "../api/axios";
import type { User } from "../types";

interface LoginResult {
  token: string;
  user: User;
}

export async function login(email: string, password: string): Promise<LoginResult> {
  const response = await api.post("/auth/login", { email, password });
  return response.data.data;
}
