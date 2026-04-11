import { useState, useEffect } from "react";
import axiosInstance from "api/axiosInstance";
import type { Course } from "types/course";

interface UseGetCourseReturn {
  course: Course | null;
  loading: boolean;
  error: string | null;
}

const useGetCourse = (uid: string | undefined): UseGetCourseReturn => {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    if (!uid) return;

    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axiosInstance.get<Course>(`/courses/${uid}`);
        setCourse(data);
      } catch (err: unknown) {
        setError(
          (err as any)?.response?.data?.detail ??
          (err as any)?.response?.data?.message ??
          "Failed to load course."
        );
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [uid]);

  return { course, loading, error };
};

export default useGetCourse;
