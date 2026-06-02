export interface TrainerSpecialization {
  uid: string;
  name: string;
  hex_color: string;
  text_color: string;
}

export interface TrainerBrief {
  uid: string;
  name: string;
  email: string;
  profile_picture: TrainerFile | string | null;
  title: string;
  country: string;
  city: string;
  whatsapp: string;
}

export interface TrainerFile {
  file_key: string;
  public_url: string;
}

export interface Trainer {
  uid: string;
  profile_picture: TrainerFile | null;
  cv: TrainerFile | null;
  specializations: TrainerSpecialization[];
  name: string;
  email: string;
  phone: string;
  bio: string;
  title: string;
  years_experience: number;
  certifications: string;
  linkedin_url: string;
  primary_email: string;
  secondary_email: string;
  address: string;
  country: string;
  city: string;
  postal_code: string;
  whatsapp: string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedTrainers {
  count: number;
  next: string | null;
  previous: string | null;
  results: TrainerBrief[];
}

export interface TrainersParams {
  page?: number;
  search?: string;
  ordering?: string;
}

export interface CreateTrainerPayload {
  name: string;
  email: string;
  profile_picture?: string;
  cv?: string;
  phone?: string;
  bio?: string;
  title?: string;
  years_experience?: number;
  certifications?: string;
  linkedin_url?: string;
  primary_email?: string;
  secondary_email?: string;
  address?: string;
  country?: string;
  city?: string;
  postal_code?: string;
  whatsapp?: string;
}

export type UpdateTrainerPayload = Partial<CreateTrainerPayload>;

export type TrainerFieldErrors = Partial<Record<keyof CreateTrainerPayload, string>> & {
  profile_picture?: string;
  cv?: string;
};
