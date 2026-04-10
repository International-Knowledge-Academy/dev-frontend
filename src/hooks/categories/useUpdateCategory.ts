import { useState } from "react";
import axiosInstance from "api/axiosInstance";
import type { Category, UpdateCategoryPayload, CategoryFieldErrors } from "types/category";

interface UseUpdateCategoryReturn {
  updateCategory: (uid: string, payload: UpdateCategoryPayload) => Promise<Category | void>;
  loading: boolean;
  error: string | null;
  fieldErrors: CategoryFieldErrors;
  reset: () => void;
}

const useUpdateCategory = (): UseUpdateCategoryReturn => {
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<CategoryFieldErrors>({});

  const updateCategory = async (uid: string, payload: UpdateCategoryPayload): Promise<Category | void> => {
    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const { data } = await axiosInstance.patch<Category>(`/categories/${uid}`, payload);
      return data;
    } catch (err: unknown) {
      const responseData = (
        err as {
          response?: {
            data?: Partial<Record<keyof UpdateCategoryPayload, string[]>> & {
              detail?: string;
              message?: string;
            };
          };
        }
      )?.response?.data;

      const fields: (keyof UpdateCategoryPayload)[] = [
        "name", "description", "type", "display_order", "is_active",
      ];

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
          "Failed to update category. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setError(null); setFieldErrors({}); };

  return { updateCategory, loading, error, fieldErrors, reset };
};

export default useUpdateCategory;
