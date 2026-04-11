import { useState } from "react";
import axiosInstance from "api/axiosInstance";

interface UseDeleteProgramReturn {
  deleteProgram: (uid: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

const useDeleteProgram = (): UseDeleteProgramReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const deleteProgram = async (uid: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.delete(`/programs/${uid}`);
      return true;
    } catch (err: unknown) {
      setError(
        (err as any)?.response?.data?.detail ??
        (err as any)?.response?.data?.message ??
        "Failed to delete program."
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteProgram, loading, error };
};

export default useDeleteProgram;
