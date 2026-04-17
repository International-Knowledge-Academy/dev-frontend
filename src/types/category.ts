export interface Category {
  uid: string;
  name: string;
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
}

export interface UpdateCategoryPayload {
  name?: string;
}

export type CategoryFieldErrors = Partial<Record<keyof CreateCategoryPayload, string>>;
