import { useState, useEffect } from "react";
import axiosInstance from "api/axiosInstance";
import type { Certificate } from "types/certificate";

interface UseCertificateReturn {
  certificate: Certificate | null;
  loading: boolean;
  error: string | null;
}

const useCertificate = (uid: string | undefined): UseCertificateReturn => {
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState<string | null>(null);

  useEffect(() => {
    if (!uid) return;
    setLoading(true);
    setError(null);
    axiosInstance
      .get<Certificate>(`/certificates/${uid}`)
      .then(({ data }) => setCertificate(data))
      .catch((err) =>
        setError(
          err?.response?.data?.detail ??
          err?.response?.data?.message ??
          "Failed to load certificate."
        )
      )
      .finally(() => setLoading(false));
  }, [uid]);

  return { certificate, loading, error };
};

export default useCertificate;
