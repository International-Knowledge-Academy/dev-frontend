export interface Service {
  uid: string;
  name: string;
  summary: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
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
}

export type UpdateServicePayload = Partial<CreateServicePayload>;

export type ServiceFieldErrors = Partial<Record<keyof CreateServicePayload, string>>;
