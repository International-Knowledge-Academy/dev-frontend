import { useState } from "react";
import axiosInstance from "api/axiosInstance";

interface UseEnrollRegistrationReturn {
  enroll: (id: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

const useEnrollRegistration = (): UseEnrollRegistrationReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const enroll = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.post(`/registrations/${id}/enroll`);
      return true;
    } catch (err: unknown) {
      setError(
        (err as any)?.response?.data?.detail ??
        (err as any)?.response?.data?.message ??
        "Failed to enroll registration."
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { enroll, loading, error };
};

export default useEnrollRegistration;
