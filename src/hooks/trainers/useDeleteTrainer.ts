import { useState } from "react";
import axiosInstance from "api/axiosInstance";

interface UseDeleteTrainerReturn {
  deleteTrainer: (uid: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

const useDeleteTrainer = (): UseDeleteTrainerReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const deleteTrainer = async (uid: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.delete(`/trainers/${uid}`);
      return true;
    } catch (err: unknown) {
      const responseData = (err as any)?.response?.data;
      setError(
        responseData?.detail ??
        responseData?.message ??
        "Failed to delete trainer."
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteTrainer, loading, error };
};

export default useDeleteTrainer;
