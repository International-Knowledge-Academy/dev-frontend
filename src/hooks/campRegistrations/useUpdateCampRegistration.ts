import { useState } from "react";
import axiosInstance from "api/axiosInstance";
import type { CampRegistration, CreateCampRegistrationPayload } from "types/campRegistration";
import normalizeFieldErrors from "./normalizeFieldErrors";

const useUpdateCampRegistration = () => {
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | null>(null);

  const updateCampRegistration = async (
    uid: string,
    payload: Partial<CreateCampRegistrationPayload>
  ): Promise<CampRegistration | null> => {
    setLoading(true);
    setError(null);
    setFieldErrors(null);
    try {
      const { data } = await axiosInstance.patch<CampRegistration>(`/camps/registrations/${uid}`, payload);
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
          "Failed to update registration."
        );
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearErrors = () => { setError(null); setFieldErrors(null); };

  return { updateCampRegistration, loading, error, fieldErrors, clearErrors };
};

export default useUpdateCampRegistration;
