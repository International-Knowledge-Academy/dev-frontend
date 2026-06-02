import { useState } from "react";
import axiosInstance from "api/axiosInstance";

interface UseDeleteRegistrationReturn {
  deleteRegistration: (id: number | string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

const useDeleteRegistration = (): UseDeleteRegistrationReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const deleteRegistration = async (id: number | string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.delete(`/registrations/${id}`);
      return true;
    } catch (err: unknown) {
      setError(
        (err as any)?.response?.data?.detail ??
        (err as any)?.response?.data?.message ??
        "Failed to delete registration."
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteRegistration, loading, error };
};

export default useDeleteRegistration;
