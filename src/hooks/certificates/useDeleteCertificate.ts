import { useState } from "react";
import axiosInstance from "api/axiosInstance";

interface UseDeleteCertificateReturn {
  deleteCertificate: (uid: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

const useDeleteCertificate = (): UseDeleteCertificateReturn => {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const deleteCertificate = async (uid: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.delete(`/certificates/${uid}`);
      return true;
    } catch (err: unknown) {
      setError(
        (err as any)?.response?.data?.detail ??
        (err as any)?.response?.data?.message ??
        "Failed to delete certificate."
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteCertificate, loading, error };
};

export default useDeleteCertificate;
