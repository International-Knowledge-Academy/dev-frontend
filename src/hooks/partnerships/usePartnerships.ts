import { useState, useEffect, useCallback } from "react";
import axiosInstance from "api/axiosInstance";
import type { Partnership, PaginatedPartnerships, PartnershipsParams } from "types/partnerships";

interface UsePartnershipsReturn {
  partnerships: Partnership[];
  count:        number;
  loading:      boolean;
  error:        string | null;
  params:       PartnershipsParams;
  setParams:    (updates: Partial<PartnershipsParams>) => void;
  refetch:      () => void;
}

const usePartnerships = (initialParams: PartnershipsParams = {}): UsePartnershipsReturn => {
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [count,        setCount]        = useState(0);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState<string | null>(null);
  const [params,       setParamsState]  = useState<PartnershipsParams>(initialParams);

  const fetchPartnerships = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.get<PaginatedPartnerships>("/partnerships", {
        params: {
          ...(params.page     && { page:     params.page     }),
          ...(params.search   && { search:   params.search   }),
          ...(params.ordering && { ordering: params.ordering }),
        },
      });
      setPartnerships(Array.isArray(data.results) ? data.results : []);
      setCount(data.count ?? 0);
    } catch (err: unknown) {
      setError(
        (err as any)?.response?.data?.detail ??
        (err as any)?.response?.data?.message ??
        "Failed to load partnerships."
      );
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => { fetchPartnerships(); }, [fetchPartnerships]);

  const setParams = (updates: Partial<PartnershipsParams>) => {
    setParamsState((prev) => ({
      ...prev,
      ...updates,
      page: "search" in updates || "ordering" in updates ? 1 : (updates.page ?? prev.page),
    }));
  };

  return { partnerships, count, loading, error, params, setParams, refetch: fetchPartnerships };
};

export default usePartnerships;
