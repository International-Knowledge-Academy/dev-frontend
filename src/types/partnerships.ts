export interface Partnership {
  uid:              string;
  name:             string;
  logo:             string;
  partnership_type: string;
  website_url:      string;
}

export interface PaginatedPartnerships {
  count:    number;
  next:     string | null;
  previous: string | null;
  results:  Partnership[];
}

export interface PartnershipsParams {
  page?:     number;
  search?:   string;
  ordering?: string;
}

export interface PartnershipPayload {
  name:             string;
  logo?:            string;
  partnership_type: string;
  website_url?:     string;
}
