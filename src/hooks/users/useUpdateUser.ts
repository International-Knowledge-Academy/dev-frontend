import { useState, useRef } from "react";
import axiosInstance from "api/axiosInstance";
import type { User } from "types/auth";
import type { UpdateUserPayload, UpdateUserFieldErrors } from "types/user";

interface LastError {
  fieldErrors: UpdateUserFieldErrors;
  error: string | null;
}

interface UseUpdateUserReturn {
  updateUser: (id: string | number, payload: UpdateUserPayload) => Promise<User | null>;
  loading: boolean;
  error: string | null;
  fieldErrors: UpdateUserFieldErrors;
  reset: () => void;
  getLastError: () => LastError;
}

const useUpdateUser = (): UseUpdateUserReturn => {
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<UpdateUserFieldErrors>({});
  const lastErrorRef                  = useRef<LastError>({ fieldErrors: {}, error: null });

  const updateUser = async (
    id: string | number,
    payload: UpdateUserPayload
  ): Promise<User | null> => {
    setLoading(true);
    setError(null);
    setFieldErrors({});
    lastErrorRef.current = { fieldErrors: {}, error: null };

    try {
      const { data } = await axiosInstance.put<User>(`/auth/users/${id}`, payload);
      return data;
    } catch (err: unknown) {
      const responseData = (err as { response?: { data?: any } })?.response?.data;

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
        lastErrorRef.current = { fieldErrors: extracted, error: null };
      } else {
        const generalError =
          responseData?.detail ??
          responseData?.message ??
          "Failed to update user. Please try again.";
        setError(generalError);
        lastErrorRef.current = { fieldErrors: {}, error: generalError };
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setError(null); setFieldErrors({}); };

  return { updateUser, loading, error, fieldErrors, reset, getLastError: () => lastErrorRef.current };
};

export default useUpdateUser;
