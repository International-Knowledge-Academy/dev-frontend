/* ─── Additional Services ─────────────────────────────────────────────────── */
export interface AdditionalService {
  id: number;
  uid: string;
  name: string;
  service_type: number;
  service_type_name: string;
  price: string;
  currency: string;
  is_active: boolean;
  available_locations: number[];
  created_at: string;
  updated_at: string;
}

export interface PaginatedAdditionalServices {
  count: number;
  next: string | null;
  previous: string | null;
  results: AdditionalService[];
}

export interface AdditionalServicesParams {
  page?: number;
  search?: string;
  ordering?: string;
}

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
