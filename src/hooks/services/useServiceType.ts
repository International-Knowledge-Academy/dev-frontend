import { useState, useEffect } from "react";
import axiosInstance from "api/axiosInstance";
import type { ServiceType } from "types/additionalService";

interface UseServiceTypeReturn {
  serviceType: ServiceType | null;
  loading: boolean;
  error: string | null;
}

const useServiceType = (uid: string): UseServiceTypeReturn => {
  const [serviceType, setServiceType] = useState<ServiceType | null>(null);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState<string | null>(null);

  useEffect(() => {
    if (!uid) return;
    setLoading(true);
    setError(null);
    axiosInstance
      .get<ServiceType>(`/services/service-types/${uid}`)
      .then(({ data }) => setServiceType(data))
      .catch((err) =>
        setError(
          err?.response?.data?.detail ??
          err?.response?.data?.message ??
          "Failed to load service type."
        )
      )
      .finally(() => setLoading(false));
  }, [uid]);

  return { serviceType, loading, error };
};

export default useServiceType;
