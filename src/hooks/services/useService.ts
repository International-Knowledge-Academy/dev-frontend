import { useState, useEffect } from "react";
import axiosInstance from "api/axiosInstance";
import type { Service } from "types/additionalService";

interface UseServiceReturn {
  service: Service | null;
  loading: boolean;
  error: string | null;
}

const useService = (uid: string | undefined): UseServiceReturn => {
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    if (!uid) return;
    setLoading(true);
    setError(null);
    axiosInstance
      .get<Service>(`/services/${uid}`)
      .then(({ data }) => setService(data))
      .catch((err) =>
        setError(
          err?.response?.data?.detail ??
          err?.response?.data?.message ??
          "Failed to load service."
        )
      )
      .finally(() => setLoading(false));
  }, [uid]);

  return { service, loading, error };
};

export default useService;
