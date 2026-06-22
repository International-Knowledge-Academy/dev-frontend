export interface ReferralCode {
  uid:                 string;
  code:                string;
  influencer_name:     string;
  influencer_platform: string;
  is_active:           boolean;
  created_at:          string;
  registrations_count: number;
}

export interface PaginatedReferralCodes {
  count:    number;
  next:     string | null;
  previous: string | null;
  results:  ReferralCode[];
}

export interface ReferralCodesParams {
  page?:      number;
  search?:    string;
  is_active?: boolean;
}

export interface ReferralCodePayload {
  code:                string;
  influencer_name:     string;
  influencer_platform: string;
  is_active:           boolean;
}
