import type { UserRole } from "./auth";

export interface UpdateUserPayload {
  email?: string;
  password?: string;
  name?: string;
  role?: UserRole;
  is_active?: boolean;
  is_staff?: boolean;
  is_superuser?: boolean;
  last_login?: string | null;
  groups?: number[];
  user_permissions?: number[];
}

export type UpdateUserFieldErrors = Partial<Record<keyof UpdateUserPayload, string>>;
