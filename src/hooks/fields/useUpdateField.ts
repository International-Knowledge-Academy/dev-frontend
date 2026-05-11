// @ts-nocheck
import { useState, useRef } from "react";
import axiosInstance from "api/axiosInstance";
import type { Field, UpdateFieldPayload, FieldFieldErrors } from "types/field";

interface LastError {
  fieldErrors: FieldFieldErrors;
  error: string | null;
}

interface UseUpdateFieldReturn {
  updateField: (uid: string, payload: UpdateFieldPayload) => Promise<Field | null>;
  loading: boolean;
  error: string | null;
  fieldErrors: FieldFieldErrors;
  reset: () => void;
  getLastError: () => LastError;
}

const useUpdateField = (): UseUpdateFieldReturn => {
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldFieldErrors>({});
  const lastErrorRef                  = useRef<LastError>({ fieldErrors: {}, error: null });

  const updateField = async (uid: string, payload: UpdateFieldPayload): Promise<Field | null> => {
    setLoading(true);
    setError(null);
    setFieldErrors({});
    lastErrorRef.current = { fieldErrors: {}, error: null };

    try {
      const { data } = await axiosInstance.patch<Field>(`/fields/${uid}`, payload);
      return data;
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: any }; message?: string };
      const responseData = axiosErr?.response?.data;

      const fieldKeys: (keyof UpdateFieldPayload)[] = [
        "name", "description", "category_uid", "is_active",
        "hex_color", "text_color", "thumbnail", "video",
      ];
      const extracted: FieldFieldErrors = {};
      fieldKeys.forEach((f) => {
        const val = responseData?.[f];
        if (Array.isArray(val) && val[0]) extracted[f] = val[0];
      });

      if (Object.keys(extracted).length) {
        setFieldErrors(extracted);
        lastErrorRef.current = { fieldErrors: extracted, error: null };
      } else {
        const nonFieldError = Array.isArray(responseData?.non_field_errors)
          ? responseData.non_field_errors[0]
          : null;
        const networkMsg = !axiosErr?.response && axiosErr?.message ? axiosErr.message : null;
        const generalError =
          responseData?.detail ??
          responseData?.message ??
          nonFieldError ??
          networkMsg ??
          "Failed to update field. Please try again.";
        setError(generalError);
        lastErrorRef.current = { fieldErrors: {}, error: generalError };
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setError(null); setFieldErrors({}); };

  return { updateField, loading, error, fieldErrors, reset, getLastError: () => lastErrorRef.current };
};

export default useUpdateField;
