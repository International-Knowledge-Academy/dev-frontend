import { useState } from "react";
import axiosInstance from "api/axiosInstance";

interface UseRejectRegistrationReturn {
  reject: (id: number | string, reason?: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

const useRejectRegistration = (): UseRejectRegistrationReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const reject = async (id: number | string, reason?: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.post(`/registrations/${id}/reject`, reason ? { reason } : {});
      return true;
    } catch (err: unknown) {
      setError(
        (err as any)?.response?.data?.detail ??
        (err as any)?.response?.data?.message ??
        "Failed to reject registration."
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { reject, loading, error };
};

export default useRejectRegistration;
