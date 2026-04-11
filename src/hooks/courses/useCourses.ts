import { useState, useEffect, useCallback } from "react";
import axiosInstance from "api/axiosInstance";
import type { PaginatedCourses, Course, CoursesParams } from "types/course";

interface UseCoursesReturn {
  courses: Course[];
  count: number;
  next: string | null;
  previous: string | null;
  loading: boolean;
  error: string | null;
  params: CoursesParams;
  setParams: (updates: Partial<CoursesParams>) => void;
  refetch: () => void;
}

const useCourses = (initialParams: CoursesParams = {}): UseCoursesReturn => {
  const [courses, setCourses]    = useState<Course[]>([]);
  const [count, setCount]        = useState(0);
  const [next, setNext]          = useState<string | null>(null);
  const [previous, setPrevious]  = useState<string | null>(null);
  const [loading, setLoading]    = useState(false);
  const [error, setError]        = useState<string | null>(null);
  const [params, setParamsState] = useState<CoursesParams>(initialParams);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.get<PaginatedCourses>("/courses", {
        params: {
          ...(params.page      && { page:      params.page }),
          ...(params.search    && { search:    params.search }),
          ...(params.ordering  && { ordering:  params.ordering }),
          ...(params.category  && { category:  params.category }),
          ...(params.location  && { location:  params.location }),
          ...(params.level     && { level:     params.level }),
          ...(params.mode      && { mode:      params.mode }),
          ...(params.status    && { status:    params.status }),
          ...(params.is_active !== undefined && { is_active: params.is_active }),
        },
      });
      setCourses(data.results);
      setCount(data.count);
      setNext(data.next);
      setPrevious(data.previous);
    } catch (err: unknown) {
      setError(
        (err as any)?.response?.data?.detail ??
        (err as any)?.response?.data?.message ??
        "Failed to load courses."
      );
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  const setParams = (updates: Partial<CoursesParams>) => {
    setParamsState((prev) => ({
      ...prev,
      ...updates,
      page:
        updates.search   !== undefined ||
        updates.category !== undefined ||
        updates.location !== undefined ||
        updates.level    !== undefined ||
        updates.mode     !== undefined ||
        updates.status   !== undefined ||
        updates.is_active !== undefined
          ? 1
          : (updates.page ?? prev.page),
    }));
  };

  return { courses, count, next, previous, loading, error, params, setParams, refetch: fetchCourses };
};

export default useCourses;
