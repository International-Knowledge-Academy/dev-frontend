import { useState, useEffect } from "react";
import axiosInstance from "api/axiosInstance";
import type { Location } from "types/location";

interface UseGetLocationReturn {
  location: Location | null;
  loading: boolean;
  error: string | null;
}

const useGetLocation = (uid: string | undefined): UseGetLocationReturn => {
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    if (!uid) return;
    setLoading(true);
    setError(null);
    axiosInstance
      .get<Location>(`/locations/${uid}`)
      .then(({ data }) => setLocation(data))
      .catch((err) => {
        const responseData = err?.response?.data;
        setError(responseData?.detail ?? responseData?.message ?? "Failed to load location.");
      })
      .finally(() => setLoading(false));
  }, [uid]);

  return { location, loading, error };
};

export default useGetLocation;
