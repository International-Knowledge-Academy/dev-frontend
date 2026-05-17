export type CertificateType   = "completion" | "achievement" | "participation" | "excellence";
export type CertificateStatus = "issued" | "revoked";

export interface Certificate {
  uid: string;
  registration: string;
  program: string;
  is_valid: string;
  certificate_pdf: string;
  certificate_number: string;
  verification_code: string;
  participant_name: string;
  participant_email: string;
  certificate_type: CertificateType;
  program_name: string;
  lead_trainer_name: string;
  issued_by: string;
  issue_date: string;
  status: CertificateStatus;
  revocation_reason: string;
  revoked_at: string | null;
  created_at: string;
  updated_at: string;
  issued_by_user: number | null;
  revoked_by_user: number | null;
}

export interface PaginatedCertificates {
  count: number;
  next: string | null;
  previous: string | null;
  results: Certificate[];
}

export interface CertificatesParams {
  page?: number;
  search?: string;
  ordering?: string;
}

export interface CreateCertificatePayload {
  registration?: string;
  program?: string;
  certificate_pdf?: string;
  participant_name: string;
  participant_email: string;
  certificate_type: CertificateType;
  program_name: string;
  lead_trainer_name?: string;
  issued_by?: string;
  status?: CertificateStatus;
  revocation_reason?: string;
  revoked_at?: string | null;
  issued_by_user?: number | null;
  revoked_by_user?: number | null;
}

export type UpdateCertificatePayload = Partial<CreateCertificatePayload>;

export type CertificateFieldErrors = Partial<Record<keyof CreateCertificatePayload, string>>;

export interface CertificateVerification {
  certificate_number: string;
  verification_code: string;
  participant_name: string;
  program_name: string;
  certificate_type: CertificateType;
  issue_date: string;
  status: CertificateStatus;
  verification_url: string;
  lead_trainer_name: string;
  issued_by: string;
  is_valid: string;
}

export interface VerifyCertificatePayload {
  verification_code?: string;
  certificate_number?: string;
}

export interface RevokeResponse {
  success: boolean;
  message: string;
}
