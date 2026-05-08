// @ts-nocheck
import { useState } from "react";
import axiosInstance from "api/axiosInstance";
import type { ServiceBooking, CreateServiceBookingPayload } from "types/additionalService";

interface UseCreateServiceBookingReturn {
  createBooking: (payload: CreateServiceBookingPayload) => Promise<ServiceBooking | null>;
  loading: boolean;
  error: string | null;
  fieldErrors: Partial<Record<keyof CreateServiceBookingPayload, string>>;
}

const useCreateServiceBooking = (): UseCreateServiceBookingReturn => {
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof CreateServiceBookingPayload, string>>>({});

  const createBooking = async (payload: CreateServiceBookingPayload): Promise<ServiceBooking | null> => {
    setLoading(true);
    setError(null);
    setFieldErrors({});
    try {
      const { data } = await axiosInstance.post<ServiceBooking>(
        "/services/service-bookings",
        payload
      );
      return data;
    } catch (err: unknown) {
      const resData = (err as any)?.response?.data;
      if (resData && typeof resData === "object") {
        const fields: Partial<Record<keyof CreateServiceBookingPayload, string>> = {};
        (Object.keys(resData) as (keyof CreateServiceBookingPayload)[]).forEach((key) => {
          if (key !== "detail" && key !== "message") {
            fields[key] = Array.isArray(resData[key]) ? resData[key][0] : resData[key];
          }
        });
        if (Object.keys(fields).length) {
          setFieldErrors(fields);
        } else {
          setError(resData.detail ?? resData.message ?? "Failed to create booking.");
        }
      } else {
        setError("Failed to create booking.");
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createBooking, loading, error, fieldErrors };
};

export default useCreateServiceBooking;
