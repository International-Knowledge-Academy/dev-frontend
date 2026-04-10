import { useState } from "react";
import axiosInstance from "api/axiosInstance";

interface UseDeleteLocationReturn {
  deleteLocation: (uid: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

const useDeleteLocation = (): UseDeleteLocationReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const deleteLocation = async (uid: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.delete(`/locations/${uid}`);
      return true;
    } catch (err: unknown) {
      const responseData = (err as { response?: { data?: { detail?: string; message?: string } } })?.response?.data;
      setError(responseData?.detail ?? responseData?.message ?? "Failed to delete location.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteLocation, loading, error };
};

export default useDeleteLocation;
