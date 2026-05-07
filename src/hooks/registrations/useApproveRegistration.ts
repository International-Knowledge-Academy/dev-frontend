import { useState } from "react";
import axiosInstance from "api/axiosInstance";

interface UseApproveRegistrationReturn {
  approve: (id: number | string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

const useApproveRegistration = (): UseApproveRegistrationReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const approve = async (id: number | string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.post(`/registrations/${id}/approve`);
      return true;
    } catch (err: unknown) {
      setError(
        (err as any)?.response?.data?.detail ??
        (err as any)?.response?.data?.message ??
        "Failed to approve registration."
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { approve, loading, error };
};

export default useApproveRegistration;
