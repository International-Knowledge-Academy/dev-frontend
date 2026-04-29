// @ts-nocheck
export interface FieldTrainer {
  uid: string;
  user: { uid: string; name: string; email: string; role: string };
  bio: string;
  title: string;
  profile_picture: string;
}

export interface Field {
  uid: string;
  name: string;
  description: string;
  category: { uid: string; name: string; summary: string } | null;
  is_active: boolean;
  program_count: number;
  hex_color: string;
  text_color: string;
  thumbnail: string;
  video: string;
  trainers: FieldTrainer[];
}

export interface PaginatedFields {
  count: number;
  next: string | null;
  previous: string | null;
  results: Field[];
}

export interface FieldsParams {
  page?: number;
  search?: string;
  ordering?: string;
  is_active?: boolean;
}

export interface CreateFieldPayload {
  name: string;
  description?: string;
  category_uid?: string;
  is_active?: boolean;
  hex_color?: string;
  text_color?: string;
  thumbnail?: string;
  video?: string;
}

export interface UpdateFieldPayload {
  name?: string;
  description?: string;
  category_uid?: string;
  is_active?: boolean;
  hex_color?: string;
  text_color?: string;
  thumbnail?: string;
  video?: string;
}

export type FieldFieldErrors = Partial<Record<keyof CreateFieldPayload, string>>;
