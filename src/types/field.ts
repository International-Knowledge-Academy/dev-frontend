// @ts-nocheck
export interface FieldTrainer {
  uid: string;
  user: { uid: string; name: string; email: string; role: string };
  bio: string;
  title: string;
  profile_picture: { file_key: string; public_url: string } | null;
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

/** Extract the display URL from a media field */
export const getMediaUrl = (media: FieldMedia | string | null | undefined): string => {
  if (!media) return "";
  if (typeof media === "string") return media;
  return media.public_url;
};

/** Extract the file_key from a media field (for API submission) */
export const getMediaKey = (media: FieldMedia | string | null | undefined): string => {
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
  category?: string;
}

export interface CreateFieldPayload {
  name: string;
  description: string;
  category_uid?: string;
  is_active?: boolean;
  hex_color?: string;
  text_color?: string;
  thumbnail?: string;
  video?: string;
  trainers?: number[];
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
