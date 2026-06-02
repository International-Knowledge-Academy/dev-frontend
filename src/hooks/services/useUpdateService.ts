import { useState } from "react";
import axiosInstance from "api/axiosInstance";
import type { Service, UpdateServicePayload, ServiceFieldErrors } from "types/additionalService";

interface UseUpdateServiceReturn {
  updateService: (uid: string, payload: UpdateServicePayload) => Promise<Service | null>;
  loading: boolean;
  error: string | null;
  fieldErrors: ServiceFieldErrors;
}

const useUpdateService = (): UseUpdateServiceReturn => {
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ServiceFieldErrors>({});

  const updateService = async (
    uid: string,
    payload: UpdateServicePayload
  ): Promise<Service | null> => {
    setLoading(true);
    setError(null);
    setFieldErrors({});
    try {
      const { data } = await axiosInstance.patch<Service>(`/services/${uid}`, payload);
      return data;
    } catch (err: unknown) {
      const resData = (err as any)?.response?.data;
      if (resData && typeof resData === "object") {
        const fields: ServiceFieldErrors = {};
        (Object.keys(resData) as string[]).forEach((key) => {
          if (key !== "detail" && key !== "message") {
            (fields as any)[key] = Array.isArray(resData[key]) ? resData[key][0] : resData[key];
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

export default useUpdateService;
