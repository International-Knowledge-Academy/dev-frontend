export type RegistrationType   = "personal" | "corporate";
export type RegistrationStatus = "pending" | "approved" | "rejected" | "completed" | "cancelled";

export interface Registration {
  id: number;
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
  program_price: string;
  registration_date: string;
  created_at: string;
  updated_at: string;
  program: number;
  manager: number | null;
  approved_by: number | null;
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
}

export interface CreateRegistrationPayload {
  program_uid: string;
  registration_type: RegistrationType;
  full_name: string;
  email: string;
  phone: string;
  job_title: string;
  address: string;
  admin_notes?: string;
  certificate_issued?: boolean;
  certificate_issue_date?: string | null;
}

export type UpdateRegistrationPayload = Partial<CreateRegistrationPayload>;

export type RegistrationFieldErrors = Partial<Record<keyof CreateRegistrationPayload, string>>;
