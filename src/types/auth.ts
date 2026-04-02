export type UserRole = "admin" | "manager";

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: UserRole;
}

export interface User {
  id: number;
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
  groups: number[];
  user_permissions: number[];
}

export interface PaginatedUsers {
  count: number;
  next: string | null;
  previous: string | null;
  results: User[];
}

export interface UsersParams {
  page?: number;
  search?: string;
  ordering?: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}
