import { useState } from "react";
import axiosInstance from "api/axiosInstance";

interface UseDeleteAdditionalServiceReturn {
  deleteService: (uid: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

const useDeleteAdditionalService = (): UseDeleteAdditionalServiceReturn => {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const deleteService = async (uid: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.delete(`/services/additional-services/${uid}`);
      return true;
    } catch (err: unknown) {
      setError(
        (err as any)?.response?.data?.detail ??
        (err as any)?.response?.data?.message ??
        "Failed to delete service."
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteService, loading, error };
};

export default useDeleteAdditionalService;
