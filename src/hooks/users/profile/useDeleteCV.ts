import { useState } from "react";
import axiosInstance from "api/axiosInstance";

interface UseDeleteCVReturn {
  deleteCV: (uid: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

const useDeleteCV = (): UseDeleteCVReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const deleteCV = async (uid: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await axiosInstance.delete(`/auth/users/${uid}/upload_cv`);
      return true;
    } catch (err: unknown) {
      const responseData = (err as { response?: { data?: any } })?.response?.data;
      setError(
        responseData?.detail ??
        responseData?.message ??
        "Failed to delete CV. Please try again."
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteCV, loading, error };
};

export default useDeleteCV;
