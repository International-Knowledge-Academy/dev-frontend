import { useState, useEffect, useCallback } from "react";
import axiosInstance from "api/axiosInstance";
import type { ServiceBooking, PaginatedServiceBookings, ServiceBookingsParams } from "types/additionalService";

interface UseServiceBookingsReturn {
  bookings: ServiceBooking[];
  count: number;
  loading: boolean;
  error: string | null;
  params: ServiceBookingsParams;
  setParams: (updates: Partial<ServiceBookingsParams>) => void;
  refetch: () => void;
}

const useServiceBookings = (initialParams: ServiceBookingsParams = {}): UseServiceBookingsReturn => {
  const [bookings,    setBookings]    = useState<ServiceBooking[]>([]);
  const [count,       setCount]       = useState(0);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [params,      setParamsState] = useState<ServiceBookingsParams>(initialParams);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.get<PaginatedServiceBookings>(
        "/services/service-bookings",
        {
          params: {
            ...(params.page     && { page:     params.page     }),
            ...(params.search   && { search:   params.search   }),
            ...(params.ordering && { ordering: params.ordering }),
          },
        }
      );
      setBookings(Array.isArray(data.results) ? data.results : []);
      setCount(data.count ?? 0);
    } catch (err: unknown) {
      setError(
        (err as any)?.response?.data?.detail ??
        (err as any)?.response?.data?.message ??
        "Failed to load service bookings."
      );
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const setParams = (updates: Partial<ServiceBookingsParams>) => {
    setParamsState((prev) => ({
      ...prev,
      ...updates,
      page: "search" in updates || "ordering" in updates ? 1 : (updates.page ?? prev.page),
    }));
  };

  return { bookings, count, loading, error, params, setParams, refetch: fetchBookings };
};

export default useServiceBookings;
