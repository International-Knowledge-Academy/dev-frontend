import { useState } from "react";
import axiosInstance from "api/axiosInstance";

interface UnassignTrainerPayload {
  trainer_profile: string;
  program: string;
}

interface UseUnassignTrainerReturn {
  unassign: (payload: UnassignTrainerPayload) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  reset: () => void;
}

const useUnassignTrainer = (): UseUnassignTrainerReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const unassign = async (payload: UnassignTrainerPayload): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await axiosInstance.delete("/program-trainers/unassign", { data: payload });
      return true;
    } catch (err: unknown) {
      const responseData = (err as { response?: { data?: any } })?.response?.data;
      const status = (err as { response?: { status?: number } })?.response?.status;
      setError(
        responseData?.detail ??
        responseData?.message ??
        (status === 404 ? "Assignment not found." : "Failed to unassign trainer. Please try again.")
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setError(null);
  };

  return { unassign, loading, error, reset };
};

export default useUnassignTrainer;
