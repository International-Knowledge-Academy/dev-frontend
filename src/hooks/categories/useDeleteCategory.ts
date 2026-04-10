import { useState } from "react";
import axiosInstance from "api/axiosInstance";

interface UseDeleteCategoryReturn {
  deleteCategory: (uid: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

const useDeleteCategory = (): UseDeleteCategoryReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const deleteCategory = async (uid: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await axiosInstance.delete(`/categories/${uid}`);
      return true;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ??
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Failed to delete category.";
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteCategory, loading, error };
};

export default useDeleteCategory;
