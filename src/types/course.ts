export type CourseLevel  = "beginner" | "intermediate" | "advanced";
export type CourseMode   = "online" | "offline" | "hybrid";
export type CourseStatus = "upcoming" | "ongoing" | "completed" | "cancelled";

export interface CourseCategory {
  uid: string;
  name: string;
  type: string;
  type_display: string;
}

export interface CourseLocation {
  uid: string;
  name: string;
  city: string;
  country: string;
}

export interface Course {
  uid: string;
  name: string;
  description: string;
  category: CourseCategory;
  location: CourseLocation;
  duration: string;
  level: CourseLevel;
  level_display: string;
  mode: CourseMode;
  mode_display: string;
  language: string;
  start_date: string | null;
  end_date: string | null;
  status: CourseStatus;
  status_display: string;
  is_active: boolean;
  // Detail-only fields (POST/GET single)
  max_participants?: number | null;
  brochure_url_en?: string;
  brochure_url_ar?: string;
  contact_email?: string;
  contact_phone?: string;
}

export interface PaginatedCourses {
  count: number;
  next: string | null;
  previous: string | null;
  results: Course[];
}

export interface CoursesParams {
  page?: number;
  search?: string;
  ordering?: string;
  category?: string;
  location?: string;
  level?: CourseLevel | "";
  mode?: CourseMode | "";
  status?: CourseStatus | "";
  language?: string;
  start_date_from?: string;
  start_date_to?: string;
  is_active?: boolean;
}

export interface CreateCoursePayload {
  name: string;
  description: string;
  category: string;
  location: string;
  duration: string;
  level: CourseLevel;
  mode: CourseMode;
  language: string;
  start_date: string;
  end_date: string;
  max_participants: number | null;
  brochure_url_en: string;
  brochure_url_ar: string;
  contact_email: string;
  contact_phone: string;
  status: CourseStatus;
  is_active: boolean;
}

export type CourseFieldErrors = Partial<Record<keyof CreateCoursePayload, string>>;
