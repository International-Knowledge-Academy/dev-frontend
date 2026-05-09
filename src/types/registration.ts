export type RegistrationType   = "personal" | "corporate";
export type RegistrationStatus = "pending" | "approved" | "rejected" | "completed" | "cancelled";

export interface RegistrationProgram {
  uid: string;
  name: string;
  mode: string;
  program_type: string;
  price: string;
}

export interface RegistrationUser {
  uid: string;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
}

export interface Registration {
  uid: string;
  registration_type: RegistrationType;
  full_name: string;
  email: string;
  phone: string;
  job_title: string;
  address: string;
  status: RegistrationStatus;
  status_changed_at: string | null;
  assigned_at: string | null;
  admin_notes: string;
  certificate_issued: boolean;
  certificate_issue_date: string | null;
  registration_date: string;
  created_at: string;
  updated_at: string;
  program: RegistrationProgram | null;
  manager: RegistrationUser | null;
  approved_by: RegistrationUser | null;
  category: number | null;
  field: number | null;
  location: number | null;
}

export interface PaginatedRegistrations {
  count: number;
  next: string | null;
  previous: string | null;
  results: Registration[];
}

export interface RegistrationsParams {
  page?: number;
  search?: string;
  ordering?: string;
  manager?: string;
  status?: RegistrationStatus | "";
  program?: number | string;
}

export interface CreateRegistrationPayload {
  program_uid: string;
  location_uid?: string;
  category_uid?: string;
  field_uid?: string;
  registration_type: RegistrationType;
  full_name: string;
  email: string;
  phone: string;
  job_title?: string;
  address?: string;
  admin_notes?: string;
  certificate_issued?: boolean;
  certificate_issue_date?: string | null;
  category?: number | null;
  field?: number | null;
  location?: number | null;
}

export type UpdateRegistrationPayload = Partial<CreateRegistrationPayload>;

export type RegistrationFieldErrors = Partial<Record<keyof CreateRegistrationPayload, string>>;
