// @ts-nocheck
import { useState, useEffect, useCallback } from "react";
import axiosInstance from "api/axiosInstance";
import type { PaginatedFields, Field } from "types/field";

interface CategoryFieldsParams {
  page?: number;
  search?: string;
  ordering?: string;
}

interface UseCategoryFieldsReturn {
  fields: Field[];
  count: number;
  next: string | null;
  previous: string | null;
  loading: boolean;
  error: string | null;
  params: CategoryFieldsParams;
  setParams: (updates: Partial<CategoryFieldsParams>) => void;
  refetch: () => void;
}

const useCategoryFields = (
  categoryUid: string | undefined,
  initialParams: CategoryFieldsParams = {}
): UseCategoryFieldsReturn => {
  const [fields, setFields]      = useState<Field[]>([]);
  const [count, setCount]        = useState(0);
  const [next, setNext]          = useState<string | null>(null);
  const [previous, setPrevious]  = useState<string | null>(null);
  const [loading, setLoading]    = useState(true);
  const [error, setError]        = useState<string | null>(null);
  const [params, setParamsState] = useState<CategoryFieldsParams>(initialParams);

  const fetchFields = useCallback(async () => {
    if (!categoryUid) return;
    setLoading(true);
    setError(null);

    try {
      const { data } = await axiosInstance.get<PaginatedFields>(
        `/categories/${categoryUid}/fields`,
        {
          params: {
            ...(params.page     && { page:     params.page }),
            ...(params.search   && { search:   params.search }),
            ...(params.ordering && { ordering: params.ordering }),
          },
        }
      );

      const raw = data as unknown;
      const results = Array.isArray(raw)
        ? (raw as Field[])
        : Array.isArray((raw as PaginatedFields).results)
          ? (raw as PaginatedFields).results
          : [];
      setFields(results);
      setCount(Array.isArray(raw) ? results.length : ((raw as PaginatedFields).count ?? results.length));
      setNext(Array.isArray(raw) ? null : ((raw as PaginatedFields).next ?? null));
      setPrevious(Array.isArray(raw) ? null : ((raw as PaginatedFields).previous ?? null));
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ??
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Failed to load fields.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [categoryUid, params]);

  useEffect(() => {
    fetchFields();
  }, [fetchFields]);

  const setParams = (updates: Partial<CategoryFieldsParams>) => {
    setParamsState((prev) => ({
      ...prev,
      ...updates,
      page:
        updates.search !== undefined || updates.ordering !== undefined
          ? 1
          : (updates.page ?? prev.page),
    }));
  };

  return {
    fields,
    count,
    next,
    previous,
    loading,
    error,
    params,
    setParams,
    refetch: fetchFields,
  };
};

export default useCategoryFields;
