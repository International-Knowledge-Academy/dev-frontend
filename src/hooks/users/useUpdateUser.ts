import { useState } from "react";
import axiosInstance from "api/axiosInstance";
import type { User } from "types/auth";
import type { UpdateUserPayload, UpdateUserFieldErrors } from "types/user";

interface UseUpdateUserReturn {
  updateUser: (id: string | number, payload: UpdateUserPayload) => Promise<User | void>;
  loading: boolean;
  error: string | null;
  fieldErrors: UpdateUserFieldErrors;
  reset: () => void;
}

const useUpdateUser = (): UseUpdateUserReturn => {
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<UpdateUserFieldErrors>({});

  const updateUser = async (
    id: string | number,
    payload: UpdateUserPayload
  ): Promise<User | void> => {
    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const { data } = await axiosInstance.put<User>(`/auth/users/${id}`, payload);
      return data;
    } catch (err: unknown) {
      const responseData = (
        err as {
          response?: {
            data?: Partial<Record<keyof UpdateUserPayload, string[]>> & {
              detail?: string;
              message?: string;
            };
          };
        }
      )?.response?.data;

      const fields: (keyof UpdateUserPayload)[] = [
        "email", "password", "name", "role",
        "is_active", "is_staff", "is_superuser",
        "groups", "user_permissions",
      ];

      const extracted: UpdateUserFieldErrors = {};
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
          "Failed to update user. Please try again."
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

  return { updateUser, loading, error, fieldErrors, reset };
};

export default useUpdateUser;
