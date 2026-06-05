// @ts-nocheck
import { useState, useEffect, useCallback } from "react";
import axiosInstance from "api/axiosInstance";
import { requestCache } from "utils/requestCache";
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

const buildEndpointAndParams = (params: FieldsParams) => {
  const endpoint = params.category
    ? `/categories/${params.category}/fields`
    : "/fields";
  const apiParams = {
    ...(params.page      && { page:     params.page }),
    ...(params.search    && { search:   params.search }),
    ...(params.ordering  && { ordering: params.ordering }),
    ...(params.page_size && { page_size: params.page_size }),
    ...(params.is_active !== undefined && { is_active: params.is_active }),
  };
  return { endpoint, apiParams };
};

const useFields = (initialParams: FieldsParams = {}): UseFieldsReturn => {
  const [fields, setFields]       = useState<Field[]>([]);
  const [count, setCount]         = useState(0);
  const [next, setNext]           = useState<string | null>(null);
  const [previous, setPrevious]   = useState<string | null>(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [params, setParamsState]  = useState<FieldsParams>(initialParams);

  const applyData = (raw: unknown) => {
    const results = Array.isArray(raw)
      ? (raw as Field[])
      : Array.isArray((raw as PaginatedFields).results)
        ? (raw as PaginatedFields).results
        : [];
    setFields(results);
    setCount(Array.isArray(raw) ? results.length : ((raw as PaginatedFields).count ?? results.length));
    setNext(Array.isArray(raw) ? null : ((raw as PaginatedFields).next ?? null));
    setPrevious(Array.isArray(raw) ? null : ((raw as PaginatedFields).previous ?? null));
  };

  const fetchFields = useCallback(async (force = false) => {
    const { endpoint, apiParams } = buildEndpointAndParams(params);
    const cacheKey = requestCache.key(endpoint, apiParams);

    if (!force) {
      const cached = requestCache.get(cacheKey);
      if (cached) { applyData(cached); setLoading(false); return; }

      const inflight = requestCache.getInflight(cacheKey);
      if (inflight) {
        setLoading(true);
        inflight.then((data) => { applyData(data); setLoading(false); }).catch(() => setLoading(false));
        return;
      }
    }

    setLoading(true);
    setError(null);

    const promise = axiosInstance
      .get(endpoint, { params: apiParams })
      .then(({ data }) => { requestCache.set(cacheKey, data); return data; });

    requestCache.setInflight(cacheKey, promise);

    try {
      const data = await promise;
      applyData(data);
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
      page:
        "search"    in updates ||
        "ordering"  in updates ||
        "is_active" in updates ||
        "category"  in updates
          ? 1
          : (updates.page ?? prev.page),
    }));
  };

  const refetch = () => {
    const { endpoint, apiParams } = buildEndpointAndParams(params);
    requestCache.invalidate(requestCache.key(endpoint, apiParams));
    fetchFields(true);
  };

  return { fields, count, next, previous, loading, error, params, setParams, refetch };
};

export default useFields;
