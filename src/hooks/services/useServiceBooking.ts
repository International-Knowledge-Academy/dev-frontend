import { useState, useEffect } from "react";
import axiosInstance from "api/axiosInstance";
import type { ServiceBooking } from "types/additionalService";

interface UseServiceBookingReturn {
  booking: ServiceBooking | null;
  loading: boolean;
  error: string | null;
}

const useServiceBooking = (uid: string): UseServiceBookingReturn => {
  const [booking, setBooking] = useState<ServiceBooking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    if (!uid) return;
    setLoading(true);
    setError(null);
    axiosInstance
      .get<ServiceBooking>(`/services/service-bookings/${uid}`)
      .then(({ data }) => setBooking(data))
      .catch((err) =>
        setError(
          err?.response?.data?.detail ??
          err?.response?.data?.message ??
          "Failed to load service booking."
        )
      )
      .finally(() => setLoading(false));
  }, [uid]);

  return { booking, loading, error };
};

export default useServiceBooking;
