import { useState } from "react";
import axiosInstance from "api/axiosInstance";

interface UseDeleteUserReturn {
  deleteUser: (id: string | number) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

const useDeleteUser = (): UseDeleteUserReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const deleteUser = async (id: string | number): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await axiosInstance.delete(`/auth/users/${id}/`);
      return true;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { detail?: string; message?: string } } })
          ?.response?.data?.detail ??
        (err as { response?: { data?: { message?: string } } })
          ?.response?.data?.message ??
        "Failed to delete user.";
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteUser, loading, error };
};

export default useDeleteUser;
