import { useState } from "react";
import axiosInstance from "api/axiosInstance";

interface UseDeleteCourseReturn {
  deleteCourse: (uid: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

const useDeleteCourse = (): UseDeleteCourseReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const deleteCourse = async (uid: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.delete(`/courses/${uid}`);
      return true;
    } catch (err: unknown) {
      setError(
        (err as any)?.response?.data?.detail ??
        (err as any)?.response?.data?.message ??
        "Failed to delete course."
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteCourse, loading, error };
};

export default useDeleteCourse;
