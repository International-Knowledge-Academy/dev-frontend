import { useState, useEffect, useCallback } from "react";
import axiosInstance from "api/axiosInstance";
import type { PaginatedLocations, Location, LocationsParams } from "types/location";

interface UseLocationsReturn {
  locations: Location[];
  count: number;
  next: string | null;
  previous: string | null;
  loading: boolean;
  error: string | null;
  params: LocationsParams;
  setParams: (updates: Partial<LocationsParams>) => void;
  refetch: () => void;
}

const useLocations = (initialParams: LocationsParams = {}): UseLocationsReturn => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [count, setCount]         = useState(0);
  const [next, setNext]           = useState<string | null>(null);
  const [previous, setPrevious]   = useState<string | null>(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [params, setParamsState]  = useState<LocationsParams>(initialParams);

  const fetchLocations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await axiosInstance.get<PaginatedLocations>("/locations", {
        params: {
          ...(params.page      && { page:      params.page }),
          ...(params.search    && { search:    params.search }),
          ...(params.ordering  && { ordering:  params.ordering }),
          ...(params.city      && { city:      params.city }),
          ...(params.country   && { country:   params.country }),
          ...(params.is_active !== undefined && { is_active: params.is_active }),
        },
      });

      setLocations(Array.isArray(data.results) ? data.results : []);
      setCount(data.count ?? 0);
      setNext(data.next ?? null);
      setPrevious(data.previous ?? null);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { detail?: string; message?: string } } })
          ?.response?.data?.detail ??
        (err as { response?: { data?: { message?: string } } })
          ?.response?.data?.message ??
        "Failed to load locations.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const setParams = (updates: Partial<LocationsParams>) => {
    setParamsState((prev) => ({
      ...prev,
      ...updates,
      // Reset to page 1 when filters change
      page:
        updates.search    !== undefined ||
        updates.ordering  !== undefined ||
        updates.city      !== undefined ||
        updates.country   !== undefined ||
        updates.is_active !== undefined
          ? 1
          : (updates.page ?? prev.page),
    }));
  };

  return {
    locations,
    count,
    next,
    previous,
    loading,
    error,
    params,
    setParams,
    refetch: fetchLocations,
  };
};

export default useLocations;
