import { useState } from "react";
import axiosInstance from "api/axiosInstance";
import type { User, UserRole } from "types/auth";

export interface CreateUserPayload {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  is_active?: boolean;
  is_staff?: boolean;
  is_superuser?: boolean;
  last_login?: string | null;
  groups?: number[];
  user_permissions?: number[];
}

export type CreateUserFieldErrors = Partial<Record<keyof CreateUserPayload, string>>;

export interface CreateUserResult {
  user: User | null;
  fieldErrors: CreateUserFieldErrors;
  error: string | null;
}

interface UseCreateUserReturn {
  createUser: (payload: CreateUserPayload) => Promise<CreateUserResult>;
  loading: boolean;
  error: string | null;
  fieldErrors: CreateUserFieldErrors;
  reset: () => void;
}

const useCreateUser = (): UseCreateUserReturn => {
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<CreateUserFieldErrors>({});

  const createUser = async (payload: CreateUserPayload): Promise<CreateUserResult> => {
    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const { data } = await axiosInstance.post<User>("/auth/users", payload);
      return { user: data, fieldErrors: {}, error: null };
    } catch (err: unknown) {
      const responseData = (err as { response?: { data?: any } })?.response?.data;

      const fields: (keyof CreateUserPayload)[] = [
        "email", "password", "name", "role",
        "is_active", "is_staff", "is_superuser",
        "groups", "user_permissions",
      ];
      const extracted: CreateUserFieldErrors = {};
      fields.forEach((field) => {
        const val = responseData?.[field];
        if (Array.isArray(val) && val[0]) extracted[field] = val[0];
      });

      if (Object.keys(extracted).length) {
        setFieldErrors(extracted);
        return { user: null, fieldErrors: extracted, error: null };
      }

      const generalError =
        responseData?.detail ??
        responseData?.message ??
        "Failed to create user. Please try again.";
      setError(generalError);
      return { user: null, fieldErrors: {}, error: generalError };
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setError(null); setFieldErrors({}); };

  return { createUser, loading, error, fieldErrors, reset };
};

export default useCreateUser;
