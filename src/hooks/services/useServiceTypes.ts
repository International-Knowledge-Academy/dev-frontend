import { useState, useEffect, useCallback } from "react";
import axiosInstance from "api/axiosInstance";
import type { ServiceType, PaginatedServiceTypes, ServiceTypesParams } from "types/additionalService";

interface UseServiceTypesReturn {
  serviceTypes: ServiceType[];
  count: number;
  loading: boolean;
  error: string | null;
  params: ServiceTypesParams;
  setParams: (updates: Partial<ServiceTypesParams>) => void;
  refetch: () => void;
}

const useServiceTypes = (initialParams: ServiceTypesParams = {}): UseServiceTypesReturn => {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [count,        setCount]        = useState(0);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState<string | null>(null);
  const [params,       setParamsState]  = useState<ServiceTypesParams>(initialParams);

  const fetchServiceTypes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.get<PaginatedServiceTypes>(
        "/services/service-types",
        {
          params: {
            ...(params.page     && { page:     params.page     }),
            ...(params.search   && { search:   params.search   }),
            ...(params.ordering && { ordering: params.ordering }),
          },
        }
      );
      setServiceTypes(Array.isArray(data.results) ? data.results : []);
      setCount(data.count ?? 0);
    } catch (err: unknown) {
      setError(
        (err as any)?.response?.data?.detail ??
        (err as any)?.response?.data?.message ??
        "Failed to load service types."
      );
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => { fetchServiceTypes(); }, [fetchServiceTypes]);

  const setParams = (updates: Partial<ServiceTypesParams>) => {
    setParamsState((prev) => ({
      ...prev,
      ...updates,
      page: "search" in updates || "ordering" in updates ? 1 : (updates.page ?? prev.page),
    }));
  };

  return { serviceTypes, count, loading, error, params, setParams, refetch: fetchServiceTypes };
};

export default useServiceTypes;
