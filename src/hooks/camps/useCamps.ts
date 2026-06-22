import { useState, useEffect, useCallback } from "react";
import axiosInstance from "api/axiosInstance";
import type { Camp, PaginatedCamps, CampStatus } from "types/camp";

interface UseCampsParams {
  page?:     number;
  search?:   string;
  status?:   CampStatus | "";
  location?: string;
  min_age?:  number | "";
  max_age?:  number | "";
}

const useCamps = (initialParams: UseCampsParams = {}) => {
  const [camps, setCamps]       = useState<Camp[]>([]);
  const [count, setCount]       = useState(0);
  const [next, setNext]         = useState<string | null>(null);
  const [previous, setPrevious] = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [params, setParamsState] = useState<UseCampsParams>(initialParams);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.get<PaginatedCamps>("/camps/", {
        params: {
          ...(params.page     && { page:     params.page }),
          ...(params.search   && { search:   params.search }),
          ...(params.status   && { status:   params.status }),
          ...(params.location && { location: params.location }),
          ...(params.min_age  && { min_age:  params.min_age }),
          ...(params.max_age  && { max_age:  params.max_age }),
        },
      });
      setCamps(Array.isArray(data.results) ? data.results : []);
      setCount(data.count ?? 0);
      setNext(data.next ?? null);
      setPrevious(data.previous ?? null);
    } catch (err: unknown) {
      setError(
        (err as any)?.response?.data?.detail ??
        (err as any)?.response?.data?.message ??
        "Failed to load camps."
      );
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => { fetch(); }, [fetch]);

  const setParams = (updates: Partial<UseCampsParams>) =>
    setParamsState((prev) => ({ ...prev, ...updates }));

  return { camps, count, next, previous, loading, error, params, setParams, refetch: fetch };
};

export default useCamps;
