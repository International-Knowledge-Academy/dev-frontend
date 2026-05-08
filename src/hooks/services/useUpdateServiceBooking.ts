// @ts-nocheck
import { useState } from "react";
import axiosInstance from "api/axiosInstance";
import type { ServiceBooking, CreateServiceBookingPayload } from "types/additionalService";

type UpdateServiceBookingPayload = Partial<CreateServiceBookingPayload>;

interface UseUpdateServiceBookingReturn {
  updateBooking: (uid: string, payload: UpdateServiceBookingPayload) => Promise<ServiceBooking | null>;
  loading: boolean;
  error: string | null;
  fieldErrors: Partial<Record<keyof UpdateServiceBookingPayload, string>>;
}

const useUpdateServiceBooking = (): UseUpdateServiceBookingReturn => {
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof UpdateServiceBookingPayload, string>>>({});

  const updateBooking = async (
    uid: string,
    payload: UpdateServiceBookingPayload
  ): Promise<ServiceBooking | null> => {
    setLoading(true);
    setError(null);
    setFieldErrors({});
    try {
      const { data } = await axiosInstance.patch<ServiceBooking>(
        `/services/service-bookings/${uid}`,
        payload
      );
      return data;
    } catch (err: unknown) {
      const resData = (err as any)?.response?.data;
      if (resData && typeof resData === "object") {
        const fields: Partial<Record<keyof UpdateServiceBookingPayload, string>> = {};
        (Object.keys(resData) as (keyof UpdateServiceBookingPayload)[]).forEach((key) => {
          if (key !== "detail" && key !== "message") {
            fields[key] = Array.isArray(resData[key]) ? resData[key][0] : resData[key];
          }
        });
        if (Object.keys(fields).length) {
          setFieldErrors(fields);
        } else {
          setError(resData.detail ?? resData.message ?? "Failed to update booking.");
        }
      } else {
        setError("Failed to update booking.");
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateBooking, loading, error, fieldErrors };
};

export default useUpdateServiceBooking;
