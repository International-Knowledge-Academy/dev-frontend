export type CategoryType = "training" | "international_youth" | "research" | string;

export interface Category {
  uid: string;
  name: string;
  summary?: string | null;
  type?: CategoryType;
  is_active?: boolean;
  display_order?: number;
  thumbnail?: { file_key: string; public_url: string } | null;
}

export interface PaginatedCategories {
  count: number;
  next: string | null;
  previous: string | null;
  results: Category[];
}

export interface CategoriesParams {
  page?: number;
  search?: string;
  ordering?: string;
  type?: string;
  is_active?: boolean;
}

export interface CreateCategoryPayload {
  name: string;
  summary?: string;
}

export interface UpdateCategoryPayload {
  name?: string;
  summary?: string;
}

export type CategoryFieldErrors = Partial<Record<keyof CreateCategoryPayload, string>>;
