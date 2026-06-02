import { useState } from "react";
import axiosInstance from "api/axiosInstance";
import type { Partnership, PartnershipPayload } from "types/partnerships";

interface FieldErrors {
  name?:             string;
  logo?:             string;
  partnership_type?: string;
  website_url?:      string;
}

interface UseCreatePartnershipReturn {
  createPartnership: (payload: PartnershipPayload) => Promise<Partnership | void>;
  loading:           boolean;
  error:             string | null;
  fieldErrors:       FieldErrors;
  reset:             () => void;
}

const useCreatePartnership = (): UseCreatePartnershipReturn => {
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const reset = () => { setError(null); setFieldErrors({}); };

  const createPartnership = async (payload: PartnershipPayload): Promise<Partnership | void> => {
    setLoading(true);
    setError(null);
    setFieldErrors({});
    try {
      const { data } = await axiosInstance.post<Partnership>("/partnerships", payload);
      return data;
    } catch (err: unknown) {
      const responseData = (err as any)?.response?.data;
      const fields: (keyof FieldErrors)[] = ["name", "logo", "partnership_type", "website_url"];
      const extracted: FieldErrors = {};
      fields.forEach((field) => {
        const val = responseData?.[field];
        if (Array.isArray(val) && val[0]) extracted[field] = val[0];
        else if (typeof val === "string")  extracted[field] = val;
      });
      if (Object.keys(extracted).length) {
        setFieldErrors(extracted);
      } else {
        setError(
          responseData?.detail ??
          responseData?.message ??
          "Failed to create partnership. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return { createPartnership, loading, error, fieldErrors, reset };
};

export default useCreatePartnership;
