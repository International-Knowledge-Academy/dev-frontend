export interface Category {
  uid: string;
  name: string;
  summary?: string | null;
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
