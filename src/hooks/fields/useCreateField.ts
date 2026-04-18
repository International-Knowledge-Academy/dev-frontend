// @ts-nocheck
import { useState } from "react";
import axiosInstance from "api/axiosInstance";
import type { Field, CreateFieldPayload } from "types/field";

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

interface UseCreateFieldReturn {
  createField: (payload: CreateFieldPayload) => Promise<Field | void>;
  loading: boolean;
  error: string | null;
  fieldErrors: FieldErrors;
}

const useCreateField = (): UseCreateFieldReturn => {
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const createField = async (payload: CreateFieldPayload): Promise<Field | void> => {
    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const { data } = await axiosInstance.post<Field>("/fields", payload);
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
          "Failed to create field. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return { createField, loading, error, fieldErrors };
};

export default useCreateField;
