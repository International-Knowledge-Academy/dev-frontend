import { useState } from "react";
import axiosInstance from "api/axiosInstance";

interface UseDeleteServiceBookingReturn {
  deleteBooking: (uid: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

const useDeleteServiceBooking = (): UseDeleteServiceBookingReturn => {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const deleteBooking = async (uid: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.delete(`/services/service-bookings/${uid}`);
      return true;
    } catch (err: unknown) {
      setError(
        (err as any)?.response?.data?.detail ??
        (err as any)?.response?.data?.message ??
        "Failed to delete booking."
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteBooking, loading, error };
};

export default useDeleteServiceBooking;
