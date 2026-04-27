import { useState } from "react";
import axiosInstance from "api/axiosInstance";
import type { Category, CreateCategoryPayload, CategoryFieldErrors } from "types/category";

interface UseCreateCategoryReturn {
  createCategory: (payload: CreateCategoryPayload) => Promise<Category | void>;
  loading: boolean;
  error: string | null;
  fieldErrors: CategoryFieldErrors;
  reset: () => void;
}

const useCreateCategory = (): UseCreateCategoryReturn => {
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<CategoryFieldErrors>({});

  const createCategory = async (payload: CreateCategoryPayload): Promise<Category | void> => {
    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const { data } = await axiosInstance.post<Category>("/categories", payload);
      return data;
    } catch (err: unknown) {
      const responseData = (
        err as {
          response?: {
            data?: Partial<Record<keyof CreateCategoryPayload, string[]>> & {
              detail?: string;
              message?: string;
            };
          };
        }
      )?.response?.data;

      const fields: (keyof CreateCategoryPayload)[] = ["name", "summary"];

      const extracted: CategoryFieldErrors = {};
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
          "Failed to create category. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setError(null); setFieldErrors({}); };

  return { createCategory, loading, error, fieldErrors, reset };
};

export default useCreateCategory;
