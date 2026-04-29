import { useState, useEffect } from "react";
import axiosInstance from "api/axiosInstance";
import type { Location, PaginatedLocations } from "types/location";

interface UseAllLocationsReturn {
  locations: Location[];
  loading: boolean;
  error: string | null;
}

const useAllLocations = (): UseAllLocationsReturn => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      const all: Location[] = [];
      let page = 1;

      try {
        while (true) {
          const { data } = await axiosInstance.get<PaginatedLocations>("/locations", {
            params: { page, is_active: true },
          });
          all.push(...data.results);
          if (!data.next) break;
          page++;
        }
        setLocations(all);
      } catch (err: unknown) {
        const responseData = (err as { response?: { data?: any } })?.response?.data;
        setError(responseData?.detail ?? responseData?.message ?? "Failed to load locations.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  return { locations, loading, error };
};

export default useAllLocations;
