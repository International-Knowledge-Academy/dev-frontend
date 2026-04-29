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
      const { data } = await axiosInstance.get<PaginatedFields>("/fields", {
        params: {
          ...(params.page      && { page:      params.page }),
          ...(params.search    && { search:    params.search }),
          ...(params.ordering  && { ordering:  params.ordering }),
          ...(params.is_active !== undefined && { is_active: params.is_active }),
        },
      });

      setFields(Array.isArray(data.results) ? data.results : []);
      setCount(data.count ?? 0);
      setNext(data.next ?? null);
      setPrevious(data.previous ?? null);
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
      // Reset to page 1 when filters change
      page:
        updates.search    !== undefined ||
        updates.ordering  !== undefined ||
        updates.is_active !== undefined
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
