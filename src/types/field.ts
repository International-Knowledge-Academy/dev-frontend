// @ts-nocheck
export interface FieldTrainer {
  uid: string;
  user: { uid: string; name: string; email: string; role: string };
  bio: string;
  title: string;
  profile_picture: string;
}

export interface FieldMedia {
  file_key: string;
  public_url: string;
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
  thumbnail: FieldMedia | null;
  video: FieldMedia | null;
  trainers: FieldTrainer[];
}

/** Extract the usable URL from a media field (API returns an object, not a plain string) */
export const getMediaUrl = (media: FieldMedia | string | null | undefined): string => {
  if (!media) return "";
  if (typeof media === "string") return media;
  return media.file_key;
};

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
