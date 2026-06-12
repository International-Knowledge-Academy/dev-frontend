import { useState } from "react";
import axiosInstance from "api/axiosInstance";

interface UseDeleteFeedbackReturn {
  deleteFeedback: (uid: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

const useDeleteFeedback = (): UseDeleteFeedbackReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const deleteFeedback = async (uid: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.delete(`/feedbacks/${uid}`);
      return true;
    } catch (err: unknown) {
      const responseData = (err as { response?: { data?: { detail?: string; message?: string } } })?.response?.data;
      setError(responseData?.detail ?? responseData?.message ?? "Failed to delete feedback.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteFeedback, loading, error };
};

export default useDeleteFeedback;
