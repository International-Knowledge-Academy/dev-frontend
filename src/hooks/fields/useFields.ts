// @ts-nocheck
import { useState, useEffect, useCallback } from "react";
import axiosInstance from "api/axiosInstance";
import type { PaginatedFields, Field, FieldsParams } from "types/field";

interface UseFieldsReturn {
  fields: Field[];
  count: number;
  next: string | null;
  previous: string | null;
  loading: boolean;
  error: string | null;
  params: FieldsParams;
  setParams: (updates: Partial<FieldsParams>) => void;
  refetch: () => void;
}

const useFields = (initialParams: FieldsParams = {}): UseFieldsReturn => {
  const [fields, setFields]       = useState<Field[]>([]);
  const [count, setCount]         = useState(0);
  const [next, setNext]           = useState<string | null>(null);
  const [previous, setPrevious]   = useState<string | null>(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [params, setParamsState]  = useState<FieldsParams>(initialParams);

  const fetchFields = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Use nested endpoint when filtering by category (flat endpoint doesn't support it)
      const endpoint = params.category
        ? `/categories/${params.category}/fields`
        : "/fields";

      const { data } = await axiosInstance.get<PaginatedFields>(endpoint, {
        params: {
          ...(params.page      && { page:     params.page }),
          ...(params.search    && { search:   params.search }),
          ...(params.ordering  && { ordering: params.ordering }),
          ...(params.is_active !== undefined && { is_active: params.is_active }),
        },
      });

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
        (err as { response?: { data?: { detail?: string; message?: string } } })
          ?.response?.data?.detail ??
        (err as { response?: { data?: { message?: string } } })
          ?.response?.data?.message ??
        "Failed to load fields.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchFields();
  }, [fetchFields]);

  const setParams = (updates: Partial<FieldsParams>) => {
    setParamsState((prev) => ({
      ...prev,
      ...updates,
      // Reset to page 1 when any filter changes (including clearing to undefined)
      page:
        "search"    in updates ||
        "ordering"  in updates ||
        "is_active" in updates ||
        "category"  in updates
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

export default useFields;
