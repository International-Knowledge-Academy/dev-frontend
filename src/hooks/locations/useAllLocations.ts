import { useState, useEffect } from "react";
import axiosInstance from "api/axiosInstance";
import { requestCache } from "utils/requestCache";
import type { Location, PaginatedLocations } from "types/location";

interface UseAllLocationsReturn {
  locations: Location[];
  loading: boolean;
  error: string | null;
}

const CACHE_KEY = requestCache.key("/locations/all", { is_active: true });

const fetchAll = (): Promise<Location[]> => {
  const cached = requestCache.get<Location[]>(CACHE_KEY);
  if (cached) return Promise.resolve(cached);

  const inflight = requestCache.getInflight<Location[]>(CACHE_KEY);
  if (inflight) return inflight;

  const promise = (async () => {
    const all: Location[] = [];
    let page = 1;
    while (true) {
      const { data } = await axiosInstance.get<PaginatedLocations>("/locations", {
        params: { page, is_active: true },
      });
      all.push(...data.results);
      if (!data.next) break;
      page++;
    }
    requestCache.set(CACHE_KEY, all);
    return all;
  })();

  requestCache.setInflight(CACHE_KEY, promise);
  return promise;
};

const useAllLocations = (): UseAllLocationsReturn => {
  const initial = requestCache.get<Location[]>(CACHE_KEY);
  const [locations, setLocations] = useState<Location[]>(initial ?? []);
  const [loading, setLoading]     = useState(!initial);
  const [error, setError]         = useState<string | null>(null);

  useEffect(() => {
    if (initial) return;
    setLoading(true);
    fetchAll()
      .then((data) => { setLocations(data); setLoading(false); })
      .catch((err) => {
        const responseData = (err as { response?: { data?: any } })?.response?.data;
        setError(responseData?.detail ?? responseData?.message ?? "Failed to load locations.");
        setLoading(false);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { locations, loading, error };
};

export default useAllLocations;
