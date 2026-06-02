import { useState, useRef } from "react";
import axiosInstance from "api/axiosInstance";
import type { Category, UpdateCategoryPayload, CategoryFieldErrors } from "types/category";

interface LastError {
  fieldErrors: CategoryFieldErrors;
  error: string | null;
}

interface UseUpdateCategoryReturn {
  updateCategory: (uid: string, payload: UpdateCategoryPayload) => Promise<Category | null>;
  loading: boolean;
  error: string | null;
  fieldErrors: CategoryFieldErrors;
  reset: () => void;
  getLastError: () => LastError;
}

const useUpdateCategory = (): UseUpdateCategoryReturn => {
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<CategoryFieldErrors>({});
  const lastErrorRef                  = useRef<LastError>({ fieldErrors: {}, error: null });

  const updateCategory = async (uid: string, payload: UpdateCategoryPayload): Promise<Category | null> => {
    setLoading(true);
    setError(null);
    setFieldErrors({});
    lastErrorRef.current = { fieldErrors: {}, error: null };

    try {
      const { data } = await axiosInstance.patch<Category>(`/categories/${uid}`, payload);
      return data;
    } catch (err: unknown) {
      const responseData = (err as { response?: { data?: any } })?.response?.data;

      const fields: (keyof UpdateCategoryPayload)[] = ["name", "summary"];
      const extracted: CategoryFieldErrors = {};
      fields.forEach((field) => {
        const val = responseData?.[field];
        if (Array.isArray(val) && val[0]) extracted[field] = val[0];
      });

      if (Object.keys(extracted).length) {
        setFieldErrors(extracted);
        lastErrorRef.current = { fieldErrors: extracted, error: null };
      } else {
        const generalError =
          responseData?.detail ??
          responseData?.message ??
          "Failed to update category. Please try again.";
        setError(generalError);
        lastErrorRef.current = { fieldErrors: {}, error: generalError };
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setError(null); setFieldErrors({}); };

  return { updateCategory, loading, error, fieldErrors, reset, getLastError: () => lastErrorRef.current };
};

export default useUpdateCategory;
