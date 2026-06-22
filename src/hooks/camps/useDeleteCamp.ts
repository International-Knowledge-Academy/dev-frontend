import { useState } from "react";
import axiosInstance from "api/axiosInstance";

const useDeleteCamp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const deleteCamp = async (uid: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.delete(`/camps/${uid}`);
      return true;
    } catch (err: unknown) {
      setError(
        (err as any)?.response?.data?.detail ??
        (err as any)?.response?.data?.message ??
        "Failed to delete camp."
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteCamp, loading, error };
};

export default useDeleteCamp;
