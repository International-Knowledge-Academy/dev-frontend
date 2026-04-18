// @ts-nocheck
import { useState } from "react";
import axiosInstance from "api/axiosInstance";
import type { Field, UpdateFieldPayload } from "types/field";

interface FieldErrors {
  name?: string;
  description?: string;
  category_uid?: string;
  is_active?: string;
  hex_color?: string;
  text_color?: string;
  thumbnail?: string;
  video?: string;
}

interface UseUpdateFieldReturn {
  updateField: (uid: string, payload: UpdateFieldPayload) => Promise<Field | void>;
  loading: boolean;
  error: string | null;
  fieldErrors: FieldErrors;
  reset: () => void;
}

const useUpdateField = (): UseUpdateFieldReturn => {
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const updateField = async (uid: string, payload: UpdateFieldPayload): Promise<Field | void> => {
    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const { data } = await axiosInstance.patch<Field>(`/fields/${uid}`, payload);
      return data;
    } catch (err: unknown) {
      const responseData = (err as { response?: { data?: any } })?.response?.data;

      const fields: (keyof FieldErrors)[] = [
        "name", "description", "category_uid", "is_active",
        "hex_color", "text_color", "thumbnail", "video",
      ];

      const extracted: FieldErrors = {};
      fields.forEach((field) => {
        const val = responseData?.[field];
        if (Array.isArray(val) && val[0]) extracted[field] = val[0];
      });

      if (Object.keys(extracted).length) {
        setFieldErrors(extracted);
      } else {
        setError(
          responseData?.detail ??
          responseData?.message ??
          "Failed to update field. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setFieldErrors({});
  };

  return { updateField, loading, error, fieldErrors, reset };
};

export default useUpdateField;
