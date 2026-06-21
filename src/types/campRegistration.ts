export type CampNationality =
  | "AE" | "BH" | "DZ" | "DJ" | "EG" | "IQ" | "JO" | "KM"
  | "KW" | "LB" | "LY" | "MA" | "MR" | "OM" | "PS" | "QA"
  | "SA" | "SD" | "SO" | "SY" | "TN" | "YE";
export type CampRegistrationType   = "self" | "child";
export type CampRegistrationStatus = "pending" | "interview_scheduled" | "accepted" | "rejected";
export type CampRegistrationSource = "website" | "whatsapp" | "referral";
export type GuardianRelationship   = "father" | "mother" | "guardian" | "other";

export interface CampParticipant {
  first_name:  string;
  last_name:   string;
  dob:         string;
  nationality: CampNationality;
  passport_no: string;
  whatsapp:    string;
  email:       string;
}

export interface CampGuardian {
  full_name:    string;
  relationship: GuardianRelationship;
  whatsapp:     string;
  email:        string;
}

export interface ReferralCodeSummary {
  uid:             string;
  code:            string;
  influencer_name: string;
}

export interface CampRegistration {
  uid:                       string;
  participant:               CampParticipant;
  guardian:                  CampGuardian | null;
  min_age:                   number | null;
  max_age:                   number | null;
  registration_type:         CampRegistrationType;
  status:                    CampRegistrationStatus;
  source:                    CampRegistrationSource;
  health_notes:              string;
  referral_source:           string;
  how_did_you_hear_about_us: string;
  referred_by_code:          string;
  referral_code:             ReferralCodeSummary | null;
  brochure_ar:               string;
  brochure_en:               string;
  submitted_at:              string;
}

export interface PaginatedCampRegistrations {
  count:    number;
  next:     string | null;
  previous: string | null;
  results:  CampRegistration[];
}

export interface CampRegistrationsParams {
  page?:              number;
  nationality?:       CampNationality | "";
  registration_type?: CampRegistrationType | "";
  source?:            CampRegistrationSource | "";
  status?:            CampRegistrationStatus | "";
}

export interface CreateCampRegistrationPayload {
  participant:                CampParticipant;
  guardian?:                  CampGuardian;
  min_age:                    number;
  max_age:                    number;
  registration_type:          CampRegistrationType;
  source:                     CampRegistrationSource;
  health_notes?:              string;
  referral_source?:           string;
  how_did_you_hear_about_us?: string;
  referred_by_code?:          string;
}
