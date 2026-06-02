import { useState } from "react";
import axiosInstance from "api/axiosInstance";

interface UseAssignRegistrationManagerReturn {
  assignManager: (id: number | string, managerUid: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

const useAssignRegistrationManager = (): UseAssignRegistrationManagerReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const assignManager = async (id: number | string, managerUid: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.post(`/registrations/${id}/assign_manager`, { manager_uid: managerUid });
      return true;
    } catch (err: unknown) {
      setError(
        (err as any)?.response?.data?.detail ??
        (err as any)?.response?.data?.message ??
        "Failed to assign manager."
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { assignManager, loading, error };
};

export default useAssignRegistrationManager;
