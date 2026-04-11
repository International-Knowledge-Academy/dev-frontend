export type ProgramType   = "course" | "diploma" | "contracted";
export type ProgramLevel  = "beginner" | "intermediate" | "advanced";
export type ProgramMode   = "online" | "offline" | "hybrid";
export type ProgramStatus = "upcoming" | "ongoing" | "completed" | "cancelled";

export interface ProgramCategory {
  uid: string;
  name: string;
  type: string;
  type_display: string;
}

export interface ProgramLocation {
  uid: string;
  name: string;
  city: string;
  country: string;
}

export interface Program {
  uid: string;
  name: string;
  description: string;
  type: ProgramType;
  type_display: string;
  category: ProgramCategory;
  location: ProgramLocation;
  duration: string;
  level: ProgramLevel;
  level_display: string;
  mode: ProgramMode;
  mode_display: string;
  language: string;
  start_date: string | null;
  end_date: string | null;
  status: ProgramStatus;
  status_display: string;
  is_active: boolean;
  // Detail-only fields
  max_participants?: number | null;
  brochure_url_en?: string;
  brochure_url_ar?: string;
  contact_email?: string;
  contact_phone?: string;
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
  category?: string;
  location?: string;
  type?: ProgramType | "";
  level?: ProgramLevel | "";
  mode?: ProgramMode | "";
  status?: ProgramStatus | "";
  language?: string;
  is_active?: boolean;
}

export interface CreateProgramPayload {
  name: string;
  description: string;
  type: ProgramType;
  category: string;
  location: string;
  duration: string;
  level: ProgramLevel;
  mode: ProgramMode;
  language: string;
  start_date: string;
  end_date: string;
  max_participants: number | null;
  brochure_url_en: string;
  brochure_url_ar: string;
  contact_email: string;
  contact_phone: string;
  status: ProgramStatus;
  is_active: boolean;
}

export type ProgramFieldErrors = Partial<Record<keyof CreateProgramPayload, string>>;
