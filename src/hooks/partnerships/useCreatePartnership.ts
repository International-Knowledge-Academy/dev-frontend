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
  createPartnership: (payload: PartnershipPayload, logoFile?: File | null) => Promise<Partnership | void>;
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

  const createPartnership = async (payload: PartnershipPayload, logoFile?: File | null): Promise<Partnership | void> => {
    setLoading(true);
    setError(null);
    setFieldErrors({});
    try {
      let response;
      if (logoFile) {
        const fd = new FormData();
        fd.append("name", payload.name);
        fd.append("partnership_type", payload.partnership_type);
        if (payload.website_url) fd.append("website_url", payload.website_url);
        fd.append("logo", logoFile);
        response = await axiosInstance.post<Partnership>("/partnerships", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        response = await axiosInstance.post<Partnership>("/partnerships", payload);
      }
      return response.data;
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
