export type SponsorshipType = "self_funded" | "company_sponsored" | "government_funded" | "scholarship";
export type PaymentStatus   = "pending" | "approved" | "cancelled" | "refunded";
export type PaymentMethod   = "cash" | "bank_transfer" | "credit_card" | "cheque" | "online";

export interface RegistrationBrief {
  uid: string;
  full_name: string;
  email: string;
  phone: string;
  status: string;
}

export interface PaymentUser {
  uid: string;
  name: string;
  email: string;
  role: string;
}

export interface Payment {
  uid: string;
  sponsorship_type: SponsorshipType;
  amount: string;
  status: PaymentStatus;
  proof: string | null;
  paid_at: string | null;
  payment_method: PaymentMethod;
  cancelled_at: string | null;
  cancelled_reason: string;
  refunded_at: string | null;
  refunded_reason: string;
  refund: string | null;
  created_at: string;
  updated_at: string;
  registration: RegistrationBrief | null;
  approved_by: PaymentUser | null;
  cancelled_by: PaymentUser | null;
  refunded_by: PaymentUser | null;
}

export interface PaginatedPayments {
  count: number;
  next: string | null;
  previous: string | null;
  results: Payment[];
}

export interface PaymentsParams {
  page?: number;
  search?: string;
  ordering?: string;
  status?: PaymentStatus | "";
  sponsorship_type?: SponsorshipType | "";
}

export interface CreatePaymentPayload {
  registration_uid: string;
  sponsorship_type: SponsorshipType;
  amount: string;
  payment_method: PaymentMethod;
  proof?: string | null;
}

export type UpdatePaymentPayload = Partial<CreatePaymentPayload>;

export type PaymentFieldErrors = Partial<Record<keyof CreatePaymentPayload, string>>;
