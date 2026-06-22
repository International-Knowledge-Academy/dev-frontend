export type CampStatus = "upcoming" | "open" | "closed" | "completed";

export interface Camp {
  uid:         string;
  name:        string;
  description: string | null;
  start_date:  string | null;
  end_date:    string | null;
  location:    string | null;
  capacity:    number | null;
  highlights:  string | null;
  deadline:    string | null;
  camp_fee:    string | null;
  min_age:     number | null;
  max_age:     number | null;
  status:      CampStatus;
  brochure:    string | null;
  created_at:  string;
}

export interface PaginatedCamps {
  count:    number;
  next:     string | null;
  previous: string | null;
  results:  Camp[];
}

export interface CreateCampPayload {
  name:         string;
  description?: string;
  start_date?:  string;
  end_date?:    string;
  location?:    string;
  capacity?:    number;
  highlights?:  string;
  deadline?:    string;
  camp_fee?:    string;
  min_age?:     number;
  max_age?:     number;
  status?:      CampStatus;
  brochure?:    string;
}

export interface CampBrochureDownloadResponse {
  message:      string;
  download_url: string;
  file_key:     string;
  expires_in:   number;
}

export interface CampBrochureUploadResponse {
  message:   string;
  file_name: string;
}
