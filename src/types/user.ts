import type { UserRole } from "./auth";

export interface UpdateProfilePayload {
  profile_picture?: string;
  cv?: string;
  title?: string;
  bio?: string;
  years_experience?: number | null;
  certifications?: string;
  linkedin_url?: string;
  primary_email?: string;
  secondary_email?: string;
  address?: string;
  country?: string;
  city?: string;
  postal_code?: string;
  phone?: string;
  whatsapp?: string;
  specializations?: number[];
}

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
  profile?: UpdateProfilePayload;
}

export type UpdateUserFieldErrors = Partial<Record<keyof Omit<UpdateUserPayload, "profile">, string>>;
