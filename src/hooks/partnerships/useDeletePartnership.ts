import { useState } from "react";
import axiosInstance from "api/axiosInstance";

interface UseDeletePartnershipReturn {
  deletePartnership: (uid: string) => Promise<boolean>;
  loading:           boolean;
  error:             string | null;
}

const useDeletePartnership = (): UseDeletePartnershipReturn => {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const deletePartnership = async (uid: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.delete(`/partnerships/${uid}`);
      return true;
    } catch (err: unknown) {
      const responseData = (err as any)?.response?.data;
      setError(responseData?.detail ?? responseData?.message ?? "Failed to delete partnership.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deletePartnership, loading, error };
};

export default useDeletePartnership;
