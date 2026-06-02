import { useState } from "react";
import axiosInstance from "api/axiosInstance";
import type { Category, CreateCategoryPayload, CategoryFieldErrors } from "types/category";

type CreateCategoryResult = {
  category: Category | null;
  fieldErrors: CategoryFieldErrors;
  error: string | null;
};

interface UseCreateCategoryReturn {
  createCategory: (payload: CreateCategoryPayload) => Promise<CreateCategoryResult>;
  loading: boolean;
  reset: () => void;
}

const useCreateCategory = (): UseCreateCategoryReturn => {
  const [loading, setLoading] = useState(false);

  const createCategory = async (payload: CreateCategoryPayload): Promise<CreateCategoryResult> => {
    setLoading(true);

    try {
      const { data } = await axiosInstance.post<Category>("/categories", payload);
      return { category: data, fieldErrors: {}, error: null };
    } catch (err: unknown) {
      const responseData = (err as { response?: { data?: any } })?.response?.data;

      const fields: (keyof CreateCategoryPayload)[] = ["name", "summary"];
      const extracted: CategoryFieldErrors = {};
      fields.forEach((field) => {
        const val = responseData?.[field];
        if (Array.isArray(val) && val[0]) extracted[field] = val[0];
      });

      if (Object.keys(extracted).length) {
        return { category: null, fieldErrors: extracted, error: null };
      }

      return {
        category: null,
        fieldErrors: {},
        error: responseData?.detail ?? responseData?.message ?? "Failed to create category. Please try again.",
      };
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {};

  return { createCategory, loading, reset };
};

export default useCreateCategory;
