import { useState, useEffect } from "react";
import axiosInstance from "api/axiosInstance";
import type { Category, PaginatedCategories } from "types/category";

interface UseAllCategoriesReturn {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const useAllCategories = (): UseAllCategoriesReturn => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      const all: Category[] = [];
      let page = 1;

      try {
        while (true) {
          const { data } = await axiosInstance.get<PaginatedCategories>("/categories", {
            params: { page },
          });
          all.push(...data.results);
          if (!data.next) break;
          page++;
        }
        setCategories(all);
      } catch (err: unknown) {
        const responseData = (err as { response?: { data?: any } })?.response?.data;
        setError(responseData?.detail ?? responseData?.message ?? "Failed to load categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  return { categories, loading, error };
};

export default useAllCategories;
