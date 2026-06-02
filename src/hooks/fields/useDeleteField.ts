// @ts-nocheck
import { useState } from "react";
import axiosInstance from "api/axiosInstance";

interface UseDeleteFieldReturn {
  deleteField: (uid: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

const useDeleteField = (): UseDeleteFieldReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const deleteField = async (uid: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.delete(`/fields/${uid}`);
      return true;
    } catch (err: unknown) {
      const responseData = (err as { response?: { data?: { detail?: string; message?: string } } })?.response?.data;
      setError(responseData?.detail ?? responseData?.message ?? "Failed to delete field.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteField, loading, error };
};

export default useDeleteField;
