import { useState, useEffect, useCallback } from "react";
import axiosInstance from "api/axiosInstance";
import type { Service, PaginatedServices, ServicesParams } from "types/additionalService";

interface UseServicesReturn {
  services: Service[];
  count: number;
  loading: boolean;
  error: string | null;
  params: ServicesParams;
  setParams: (updates: Partial<ServicesParams>) => void;
  refetch: () => void;
}

const useServices = (initialParams: ServicesParams = {}): UseServicesReturn => {
  const [services,     setServices]    = useState<Service[]>([]);
  const [count,        setCount]       = useState(0);
  const [loading,      setLoading]     = useState(false);
  const [error,        setError]       = useState<string | null>(null);
  const [params,       setParamsState] = useState<ServicesParams>(initialParams);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.get<PaginatedServices>("/services", {
        params: {
          ...(params.page                       && { page:      params.page      }),
          ...(params.search                     && { search:    params.search    }),
          ...(params.ordering                   && { ordering:  params.ordering  }),
          ...(params.is_active !== undefined    && { is_active: params.is_active }),
        },
      });
      setServices(Array.isArray(data.results) ? data.results : []);
      setCount(data.count ?? 0);
    } catch (err: unknown) {
      setError(
        (err as any)?.response?.data?.detail ??
        (err as any)?.response?.data?.message ??
        "Failed to load services."
      );
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  const setParams = (updates: Partial<ServicesParams>) => {
    setParamsState((prev) => ({
      ...prev,
      ...updates,
      page: "search" in updates || "ordering" in updates || "is_active" in updates ? 1 : (updates.page ?? prev.page),
    }));
  };

  return { services, count, loading, error, params, setParams, refetch: fetchServices };
};

export default useServices;
