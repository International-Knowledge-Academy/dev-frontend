export type UserRole = "admin" | "account_manager" | "trainer";

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: UserRole;
}

export interface UserProfile {
  uid: string;
  title: string;
  bio: string;
  years_experience: number | null;
  certifications: string;
  linkedin_url: string;
  cv: string | null;
  primary_email: string;
  secondary_email: string;
  address: string;
  country: string;
  city: string;
  postal_code: string;
  phone: string;
  whatsapp: string;
  profile_picture: string | null;
  specializations: number[];
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
  profile?: UserProfile | null;
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
  role?: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}
