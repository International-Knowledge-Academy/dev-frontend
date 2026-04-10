import { useState, useEffect } from "react";
import axiosInstance from "api/axiosInstance";
import type { Category } from "types/category";

interface UseGetCategoryReturn {
  category: Category | null;
  loading: boolean;
  error: string | null;
}

const useGetCategory = (uid: string | undefined): UseGetCategoryReturn => {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    if (!uid) return;

    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axiosInstance.get<Category>(`/categories/${uid}`);
        setCategory(data);
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ??
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          "Failed to load category.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [uid]);

  return { category, loading, error };
};

export default useGetCategory;
