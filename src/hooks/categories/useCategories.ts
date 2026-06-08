import { useState, useEffect, useCallback } from "react";
import axiosInstance from "api/axiosInstance";
import { requestCache } from "utils/requestCache";
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

const buildApiParams = (params: CategoriesParams) => ({
  ...(params.page      && { page:      params.page      }),
  ...(params.page_size && { page_size: params.page_size }),
  ...(params.search    && { search:    params.search    }),
  ...(params.ordering  && { ordering:  params.ordering  }),
  ...(params.type      && { type:      params.type      }),
  ...(params.is_active !== undefined && { is_active: params.is_active }),
});

const useCategories = (initialParams: CategoriesParams = {}): UseCategoriesReturn => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [count, setCount]           = useState(0);
  const [next, setNext]             = useState<string | null>(null);
  const [previous, setPrevious]     = useState<string | null>(null);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [params, setParamsState]    = useState<CategoriesParams>(initialParams);

  const fetchCategories = useCallback(async (force = false) => {
    const apiParams = buildApiParams(params);
    const cacheKey  = requestCache.key("/categories", apiParams);

    if (!force) {
      const cached = requestCache.get<PaginatedCategories>(cacheKey);
      if (cached) {
        setCategories(Array.isArray(cached.results) ? cached.results : []);
        setCount(cached.count ?? 0);
        setNext(cached.next ?? null);
        setPrevious(cached.previous ?? null);
        setLoading(false);
        return;
      }

      const inflight = requestCache.getInflight<PaginatedCategories>(cacheKey);
      if (inflight) {
        setLoading(true);
        inflight
          .then((data) => {
            setCategories(Array.isArray(data.results) ? data.results : []);
            setCount(data.count ?? 0);
            setNext(data.next ?? null);
            setPrevious(data.previous ?? null);
            setLoading(false);
          })
          .catch(() => setLoading(false));
        return;
      }
    }

    setLoading(true);
    setError(null);

    const promise = axiosInstance
      .get<PaginatedCategories>("/categories", { params: apiParams })
      .then(({ data }) => {
        requestCache.set(cacheKey, data);
        return data;
      });

    requestCache.setInflight(cacheKey, promise);

    try {
      const data = await promise;
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
        "search"   in updates ||
        "ordering" in updates
          ? 1
          : (updates.page ?? prev.page),
    }));
  };

  const refetch = () => {
    const apiParams = buildApiParams(params);
    requestCache.invalidate(requestCache.key("/categories", apiParams));
    fetchCategories(true);
  };

  return { categories, count, next, previous, loading, error, params, setParams, refetch };
};

export default useCategories;
