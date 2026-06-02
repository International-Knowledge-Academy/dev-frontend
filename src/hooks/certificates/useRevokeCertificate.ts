import { useState } from "react";
import axiosInstance from "api/axiosInstance";
import type { RevokeResponse } from "types/certificate";

interface UseRevokeCertificateReturn {
  revokeCertificate: (uid: string, reason: string) => Promise<RevokeResponse | null>;
  loading: boolean;
  error: string | null;
}

const useRevokeCertificate = (): UseRevokeCertificateReturn => {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const revokeCertificate = async (uid: string, reason: string): Promise<RevokeResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.post<RevokeResponse>(
        `/certificates/${uid}/revoke`,
        { reason }
      );
      return data;
    } catch (err: unknown) {
      setError(
        (err as any)?.response?.data?.detail ??
        (err as any)?.response?.data?.message ??
        "Failed to revoke certificate."
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { revokeCertificate, loading, error };
};

export default useRevokeCertificate;
