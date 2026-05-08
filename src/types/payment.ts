export type SponsorshipType = "self_funded" | "company_sponsored" | "government_funded" | "scholarship";
export type PaymentStatus  = "pending" | "approved" | "cancelled" | "refunded";
export type PaymentMethod  = "cash" | "bank_transfer" | "credit_card" | "cheque" | "online";

export interface Payment {
  id: number;
  uid: string;
  sponsorship_type: SponsorshipType;
  amount: string;
  status: PaymentStatus;
  proof: string | null;
  paid_at: string | null;
  payment_method: PaymentMethod;
  cancelled_at: string | null;
  cancelled_reason: string;
  registration: number;
  approved_by: number | null;
  cancelled_by: number | null;
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
}

export interface CreatePaymentPayload {
  sponsorship_type: SponsorshipType;
  amount: string;
  payment_method: PaymentMethod;
  proof?: string | null;
  cancelled_at?: string | null;
  cancelled_reason?: string;
  registration: number;
  approved_by?: number | null;
  cancelled_by?: number | null;
}

export type UpdatePaymentPayload = Partial<CreatePaymentPayload>;

export type PaymentFieldErrors = Partial<Record<keyof CreatePaymentPayload, string>>;
