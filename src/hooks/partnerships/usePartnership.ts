import { useState, useEffect } from "react";
import axiosInstance from "api/axiosInstance";
import type { Partnership } from "types/partnerships";

interface UsePartnershipReturn {
  partnership: Partnership | null;
  loading:     boolean;
  error:       string | null;
}

const usePartnership = (uid: string | undefined): UsePartnershipReturn => {
  const [partnership, setPartnership] = useState<Partnership | null>(null);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState<string | null>(null);

  useEffect(() => {
    if (!uid) return;
    setLoading(true);
    setError(null);
    axiosInstance
      .get<Partnership>(`/partnerships/${uid}`)
      .then(({ data }) => setPartnership(data))
      .catch((err) => {
        setError(
          err?.response?.data?.detail ??
          err?.response?.data?.message ??
          "Failed to load partnership."
        );
      })
      .finally(() => setLoading(false));
  }, [uid]);

  return { partnership, loading, error };
};

export default usePartnership;
