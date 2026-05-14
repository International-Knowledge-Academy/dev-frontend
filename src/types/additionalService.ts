/* ─── Services ───────────────────────────────────────────────────────────── */
export interface Service {
  uid: string;
  name: string;
  summary: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  registration: number;
}

export interface PaginatedServices {
  count: number;
  next: string | null;
  previous: string | null;
  results: Service[];
}

export interface ServicesParams {
  page?: number;
  search?: string;
  ordering?: string;
  is_active?: boolean;
}

export interface CreateServicePayload {
  name: string;
  summary?: string;
  is_active?: boolean;
  registration?: number;
  registration_uid?: string;
}

export type UpdateServicePayload = Partial<CreateServicePayload>;

export type ServiceFieldErrors = Partial<Record<keyof CreateServicePayload, string>>;

/* ─── Service Types ───────────────────────────────────────────────────────── */
export interface ServiceType {
  id: number;
  uid: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedServiceTypes {
  count: number;
  next: string | null;
  previous: string | null;
  results: ServiceType[];
}

export interface ServiceTypesParams {
  page?: number;
  search?: string;
  ordering?: string;
}

/* ─── Service Bookings ────────────────────────────────────────────────────── */
export type BookingStatus = "pending" | "confirmed" | "cancelled";

export interface ServiceBooking {
  id: number;
  uid: string;
  quantity: number;
  total_price: string;
  booking_date: string;
  service_date: string;
  notes: string;
  status: BookingStatus;
  registration: number;
  service: number;
  created_at: string;
  updated_at: string;
}

export interface PaginatedServiceBookings {
  count: number;
  next: string | null;
  previous: string | null;
  results: ServiceBooking[];
}

export interface ServiceBookingsParams {
  page?: number;
  search?: string;
  ordering?: string;
}

export interface CreateServiceBookingPayload {
  quantity: number;
  total_price: string;
  service_date: string;
  notes?: string;
  status?: BookingStatus;
  registration: number;
  service: number;
}
