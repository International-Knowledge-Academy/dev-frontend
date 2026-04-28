import type { ProgramType, ProgramLevel, ProgramMode, ProgramStatus } from "./program";

export interface ProgramTrainerUser {
  uid: string;
  name: string;
  email: string;
  role: string;
}

export interface ProgramTrainerProfileBrief {
  uid: string;
  user: ProgramTrainerUser;
  bio: string;
  title: string;
  profile_picture: string;
}

export interface ProgramTrainerField {
  uid: string;
  name: string;
  hex_color: string;
  text_color: string;
}

export interface ProgramTrainerLocation {
  uid: string;
  name: string;
  country: string;
  city: string;
  address: string;
}

export interface ProgramTrainerProgram {
  uid: string;
  name: string;
  description: string;
  field: ProgramTrainerField | null;
  location: ProgramTrainerLocation | null;
  program_type: ProgramType;
  duration: string;
  level: ProgramLevel;
  mode: ProgramMode;
  start_date: string | null;
  end_date: string | null;
  status: ProgramStatus;
  is_active: boolean;
  thumbnail: string | null;
  price: string;
  currency: string;
  trainer_profiles: ProgramTrainerProfileBrief[];
}

export interface ProgramTrainerAssignment {
  uid: string;
  trainer_profile: ProgramTrainerProfileBrief;
  is_lead_instructor: boolean;
  notes: string;
  program: ProgramTrainerProgram;
}

export interface PaginatedProgramTrainers {
  count: number;
  next: string | null;
  previous: string | null;
  results: ProgramTrainerAssignment[];
}
