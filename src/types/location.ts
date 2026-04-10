export interface Location {
  uid: string;
  name: string;
  city: string;
  country: string;
  address: string;
  venue_details: string;
  latitude: string;
  longitude: string;
  is_active: boolean;
  course_count: number;
  created_at: string;
  updated_at: string;
}

export interface PaginatedLocations {
  count: number;
  next: string | null;
  previous: string | null;
  results: Location[];
}

export interface LocationsParams {
  page?: number;
  search?: string;
  ordering?: string;
  city?: string;
  country?: string;
  is_active?: boolean;
}
