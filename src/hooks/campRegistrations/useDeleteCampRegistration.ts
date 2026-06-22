import { useState } from "react";
import axiosInstance from "api/axiosInstance";

const useDeleteCampRegistration = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const deleteCampRegistration = async (uid: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.delete(`/camps/registrations/${uid}`);
      return true;
    } catch (err: unknown) {
      setError(
        (err as any)?.response?.data?.detail ??
        (err as any)?.response?.data?.message ??
        "Failed to delete camp registration."
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteCampRegistration, loading, error };
};

export default useDeleteCampRegistration;
