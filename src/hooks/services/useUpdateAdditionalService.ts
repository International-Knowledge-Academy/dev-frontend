import { useState } from "react";
import axiosInstance from "api/axiosInstance";
import type { AdditionalService, UpdateAdditionalServicePayload } from "types/additionalService";

interface UseUpdateAdditionalServiceReturn {
  updateService: (uid: string, payload: UpdateAdditionalServicePayload) => Promise<AdditionalService | null>;
  loading: boolean;
  error: string | null;
  fieldErrors: Partial<Record<keyof UpdateAdditionalServicePayload, string>>;
}

const useUpdateAdditionalService = (): UseUpdateAdditionalServiceReturn => {
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof UpdateAdditionalServicePayload, string>>>({});

  const updateService = async (
    uid: string,
    payload: UpdateAdditionalServicePayload
  ): Promise<AdditionalService | null> => {
    setLoading(true);
    setError(null);
    setFieldErrors({});
    try {
      const { data } = await axiosInstance.patch<AdditionalService>(
        `/services/additional-services/${uid}`,
        payload
      );
      return data;
    } catch (err: unknown) {
      const resData = (err as any)?.response?.data;
      if (resData && typeof resData === "object") {
        const fields: Partial<Record<keyof UpdateAdditionalServicePayload, string>> = {};
        (Object.keys(resData) as (keyof UpdateAdditionalServicePayload)[]).forEach((key) => {
          if (key !== "detail" && key !== "message") {
            fields[key] = Array.isArray(resData[key]) ? resData[key][0] : resData[key];
          }
        });
        if (Object.keys(fields).length) {
          setFieldErrors(fields);
        } else {
          setError(resData.detail ?? resData.message ?? "Failed to update service.");
        }
      } else {
        setError("Failed to update service.");
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateService, loading, error, fieldErrors };
};

export default useUpdateAdditionalService;
