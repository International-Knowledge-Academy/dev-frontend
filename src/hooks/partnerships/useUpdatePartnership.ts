import { useState } from "react";
import axiosInstance from "api/axiosInstance";
import type { Partnership, PartnershipPayload } from "types/partnerships";

interface FieldErrors {
  name?:             string;
  logo?:             string;
  partnership_type?: string;
  website_url?:      string;
}

interface UseUpdatePartnershipReturn {
  updatePartnership: (uid: string, payload: Partial<PartnershipPayload>) => Promise<Partnership | void>;
  loading:           boolean;
  error:             string | null;
  fieldErrors:       FieldErrors;
  reset:             () => void;
}

const useUpdatePartnership = (): UseUpdatePartnershipReturn => {
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const updatePartnership = async (uid: string, payload: Partial<PartnershipPayload>): Promise<Partnership | void> => {
    setLoading(true);
    setError(null);
    setFieldErrors({});
    try {
      const { data } = await axiosInstance.patch<Partnership>(`/partnerships/${uid}`, payload);
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
          "Failed to update partnership. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setError(null); setFieldErrors({}); };

  return { updatePartnership, loading, error, fieldErrors, reset };
};

export default useUpdatePartnership;
