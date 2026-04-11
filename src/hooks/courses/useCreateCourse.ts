import { useState } from "react";
import axiosInstance from "api/axiosInstance";
import type { Course, CreateCoursePayload, CourseFieldErrors } from "types/course";

interface UseCreateCourseReturn {
  createCourse: (payload: CreateCoursePayload) => Promise<Course | void>;
  loading: boolean;
  error: string | null;
  fieldErrors: CourseFieldErrors;
  reset: () => void;
}

const useCreateCourse = (): UseCreateCourseReturn => {
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<CourseFieldErrors>({});

  const createCourse = async (payload: CreateCoursePayload): Promise<Course | void> => {
    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const { data } = await axiosInstance.post<Course>("/courses", payload);
      return data;
    } catch (err: unknown) {
      const responseData = (err as any)?.response?.data;

      const fields: (keyof CreateCoursePayload)[] = [
        "name", "description", "category", "location", "duration",
        "level", "mode", "language", "start_date", "end_date",
        "max_participants", "brochure_url_en", "brochure_url_ar",
        "contact_email", "contact_phone", "status", "is_active",
      ];

      const extracted: CourseFieldErrors = {};
      fields.forEach((field) => {
        const val = responseData?.[field];
        if (Array.isArray(val) && val[0]) extracted[field] = val[0];
      });

      if (Object.keys(extracted).length) {
        setFieldErrors(extracted);
      } else {
        setError(
          responseData?.detail ??
          responseData?.message ??
          "Failed to create course. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setError(null); setFieldErrors({}); };

  return { createCourse, loading, error, fieldErrors, reset };
};

export default useCreateCourse;
