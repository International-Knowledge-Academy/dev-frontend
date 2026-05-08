import { useState, useEffect } from "react";
import axiosInstance from "api/axiosInstance";
import type { AdditionalService } from "types/additionalService";

interface UseAdditionalServiceReturn {
  service: AdditionalService | null;
  loading: boolean;
  error: string | null;
}

const useAdditionalService = (uid: string): UseAdditionalServiceReturn => {
  const [service, setService] = useState<AdditionalService | null>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    if (!uid) return;
    setLoading(true);
    setError(null);
    axiosInstance
      .get<AdditionalService>(`/services/additional-services/${uid}`)
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

export default useAdditionalService;
