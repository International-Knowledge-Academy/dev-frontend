import { useState, useEffect, useCallback } from "react";
import axiosInstance from "api/axiosInstance";
import type {
  AdditionalService,
  PaginatedAdditionalServices,
  AdditionalServicesParams,
} from "types/additionalService";

interface UseAdditionalServicesReturn {
  services: AdditionalService[];
  count: number;
  loading: boolean;
  error: string | null;
  params: AdditionalServicesParams;
  setParams: (updates: Partial<AdditionalServicesParams>) => void;
  refetch: () => void;
}

const useAdditionalServices = (
  initialParams: AdditionalServicesParams = {}
): UseAdditionalServicesReturn => {
  const [services,   setServices]   = useState<AdditionalService[]>([]);
  const [count,      setCount]      = useState(0);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState<string | null>(null);
  const [params,     setParamsState] = useState<AdditionalServicesParams>(initialParams);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.get<PaginatedAdditionalServices>(
        "/services/additional-services",
        {
          params: {
            ...(params.page     && { page:     params.page     }),
            ...(params.search   && { search:   params.search   }),
            ...(params.ordering && { ordering: params.ordering }),
          },
        }
      );
      setServices(Array.isArray(data.results) ? data.results : []);
      setCount(data.count ?? 0);
    } catch (err: unknown) {
      setError(
        (err as any)?.response?.data?.detail ??
        (err as any)?.response?.data?.message ??
        "Failed to load additional services."
      );
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  const setParams = (updates: Partial<AdditionalServicesParams>) => {
    setParamsState((prev) => ({
      ...prev,
      ...updates,
      page: "search" in updates || "ordering" in updates ? 1 : (updates.page ?? prev.page),
    }));
  };

  return { services, count, loading, error, params, setParams, refetch: fetchServices };
};

export default useAdditionalServices;
