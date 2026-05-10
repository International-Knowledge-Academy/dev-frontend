import { useState } from "react";
import axiosInstance from "api/axiosInstance";
import type { Field, CreateFieldPayload, FieldFieldErrors } from "types/field";

type CreateFieldResult = {
  field: Field | null;
  fieldErrors: FieldFieldErrors;
  error: string | null;
};

interface UseCreateFieldReturn {
  createField: (payload: CreateFieldPayload) => Promise<CreateFieldResult>;
  loading: boolean;
}

const useCreateField = (): UseCreateFieldReturn => {
  const [loading, setLoading] = useState(false);

  const createField = async (payload: CreateFieldPayload): Promise<CreateFieldResult> => {
    setLoading(true);

    try {
      const { data } = await axiosInstance.post<Field>("/fields", payload);
      return { field: data, fieldErrors: {}, error: null };
    } catch (err: unknown) {
      const responseData = (err as { response?: { data?: any } })?.response?.data;

      const fields: (keyof CreateFieldPayload)[] = [
        "name", "description", "category_uid", "is_active",
        "hex_color", "text_color", "thumbnail", "video",
      ];
      const extracted: FieldFieldErrors = {};
      fields.forEach((f) => {
        const val = responseData?.[f];
        if (Array.isArray(val) && val[0]) extracted[f] = val[0];
      });

      if (Object.keys(extracted).length) {
        return { field: null, fieldErrors: extracted, error: null };
      }

      return {
        field: null,
        fieldErrors: {},
        error: responseData?.detail ?? responseData?.message ?? "Failed to create field. Please try again.",
      };
    } finally {
      setLoading(false);
    }
  };

  return { createField, loading };
};

export default useCreateField;
