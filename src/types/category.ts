export type CategoryType = "training" | "international_youth" | "research";

export interface Category {
  uid: string;
  name: string;
  description: string;
  type: CategoryType;
  type_display: string;
  display_order: number;
  is_active: boolean;
  course_count: number;
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
  type?: CategoryType | "";
  is_active?: boolean;
}

export interface CreateCategoryPayload {
  name: string;
  description: string;
  type: CategoryType;
  display_order?: number;
  is_active?: boolean;
}

export interface UpdateCategoryPayload {
  name?: string;
  description?: string;
  type?: CategoryType;
  display_order?: number;
  is_active?: boolean;
}

export type CategoryFieldErrors = Partial<Record<keyof CreateCategoryPayload, string>>;
