import { useState, useEffect, useCallback } from "react";
import axiosInstance from "api/axiosInstance";
import type { PaginatedCategories, Category, CategoriesParams } from "types/category";

interface UseCategoriesReturn {
  categories: Category[];
  count: number;
  next: string | null;
  previous: string | null;
  loading: boolean;
  error: string | null;
  params: CategoriesParams;
  setParams: (updates: Partial<CategoriesParams>) => void;
  refetch: () => void;
}

const useCategories = (initialParams: CategoriesParams = {}): UseCategoriesReturn => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [count, setCount]           = useState(0);
  const [next, setNext]             = useState<string | null>(null);
  const [previous, setPrevious]     = useState<string | null>(null);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [params, setParamsState]    = useState<CategoriesParams>(initialParams);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await axiosInstance.get<PaginatedCategories>("/categories", {
        params: {
          ...(params.page      && { page:      params.page }),
          ...(params.search    && { search:    params.search }),
          ...(params.ordering  && { ordering:  params.ordering }),
        },
      });

      setCategories(Array.isArray(data.results) ? data.results : []);
      setCount(data.count ?? 0);
      setNext(data.next ?? null);
      setPrevious(data.previous ?? null);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ??
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Failed to load categories.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const setParams = (updates: Partial<CategoriesParams>) => {
    setParamsState((prev) => ({
      ...prev,
      ...updates,
      page:
        updates.search   !== undefined ||
        updates.ordering !== undefined
          ? 1
          : (updates.page ?? prev.page),
    }));
  };

  return { categories, count, next, previous, loading, error, params, setParams, refetch: fetchCategories };
};

export default useCategories;
