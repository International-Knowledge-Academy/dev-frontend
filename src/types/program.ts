export type ProgramType   = "course" | "diploma" | "contracted";
export type ProgramLevel  = "beginner" | "intermediate" | "advanced";
export type ProgramMode   = "online" | "offline" | "hybrid";
export type ProgramStatus = "upcoming" | "ongoing" | "completed" | "cancelled";

export interface ProgramField {
  uid: string;
  name: string;
  hex_color?: string;
  text_color?: string;
}

export interface ProgramLocation {
  uid: string;
  name: string;
  city: string;
  country: string;
  address?: string;
  venue_details?: string;
  contact_phone?: string;
  whatsapp_number?: string;
}

export interface ProgramTrainer {
  uid: string;
  user: { uid: string; name: string; email?: string; role?: string };
  bio?: string;
  title: string;
  profile_picture: { file_key: string; public_url: string } | null;
}

export interface ProgramTrainerFlat {
  uid: string;
  name: string;
  email: string;
  profile_picture: { file_key: string; public_url: string } | null;
  title: string;
  country: string;
  city: string;
  whatsapp: string;
}

export interface Program {
  id?: number;
  uid: string;
  name: string;
  description: string;
  objectives: string;
  target_audience: string;
  prerequisites: string;
  program_type: ProgramType;
  program_type_display?: string;
  field: ProgramField | null;
  location: ProgramLocation | null;
  trainers: ProgramTrainerFlat[];
  trainer_profiles: ProgramTrainer[];
  duration: string;
  level: ProgramLevel;
  level_display?: string;
  mode: ProgramMode;
  mode_display?: string;
  language: string;
  start_date: string | null;
  end_date: string | null;
  status: ProgramStatus;
  status_display?: string;
  is_active: boolean;
  max_participants?: number | null;
  contact_email?: string;
  contact_phone?: string;
  thumbnail?: { file_key: string; public_url: string } | null;
  price?: string;
  currency?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PaginatedPrograms {
  count: number;
  next: string | null;
  previous: string | null;
  results: Program[];
}

export interface ProgramsParams {
  page?: number;
  search?: string;
  ordering?: string;
  field?: string;
  location?: string;
  program_type?: ProgramType | "";
  level?: ProgramLevel | "";
  mode?: ProgramMode | "";
  status?: ProgramStatus | "";
  language?: string;
  start_date_from?: string;
  start_date_to?: string;
  is_active?: boolean;
  trainer?: string;
  category?: string;
}

export interface CreateProgramPayload {
  name: string;
  description?: string;
  objectives?: string;
  target_audience?: string;
  prerequisites?: string;
  field_uid?: string;
  location_uid?: string;
  trainer_uids?: string[];
  program_type: ProgramType;
  duration?: string;
  level: ProgramLevel;
  mode: ProgramMode;
  language?: string;
  start_date?: string;
  end_date?: string;
  max_participants?: number | null;
  contact_email?: string;
  contact_phone?: string;
  status: ProgramStatus;
  is_active: boolean;
  thumbnail?: { file_key: string; public_url: string } | null;
  price?: string;
  currency?: string;
}

export type ProgramFieldErrors = Partial<Record<keyof CreateProgramPayload, string>>;
