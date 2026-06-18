import { useState } from "react";
import axiosInstance from "api/axiosInstance";
import type { CampRegistration, CreateCampRegistrationPayload } from "types/campRegistration";
import normalizeFieldErrors from "./normalizeFieldErrors";

const useCreateCampRegistration = () => {
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | null>(null);

  const createCampRegistration = async (
    payload: CreateCampRegistrationPayload
  ): Promise<CampRegistration | null> => {
    setLoading(true);
    setError(null);
    setFieldErrors(null);
    try {
      const { data } = await axiosInstance.post<CampRegistration>(
        "/registrations/camps/registrations",
        payload
      );
      return data;
    } catch (err: unknown) {
      const responseData = (err as any)?.response?.data;

      const normalized = normalizeFieldErrors(responseData);
      if (Object.keys(normalized).length && !responseData?.detail) {
        setFieldErrors(normalized);
      } else {
        setError(
          responseData?.detail ??
          responseData?.message ??
          "Submission failed. Please try again."
        );
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createCampRegistration, loading, error, fieldErrors };
};

export default useCreateCampRegistration;
