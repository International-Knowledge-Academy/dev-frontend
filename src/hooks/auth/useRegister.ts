import { useState } from "react";
import axiosInstance from "api/axiosInstance";
import type { RegisterPayload, RegisterResponse } from "types/register";

interface UseRegisterReturn {
  register: (payload: RegisterPayload) => Promise<RegisterResponse | void>;
  loading: boolean;
  error: string | null;
  fieldErrors: Partial<Record<keyof RegisterPayload, string>>;
  reset: () => void;
}

const useRegister = (): UseRegisterReturn => {
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof RegisterPayload, string>>>({});

  const register = async (payload: RegisterPayload): Promise<RegisterResponse | void> => {
    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const { data } = await axiosInstance.post<RegisterResponse>(
        "/auth/register",
        payload
      );
      return data;
    } catch (err: unknown) {
      const responseData = (
        err as {
          response?: {
            data?: Partial<Record<keyof RegisterPayload, string[]>> & {
              detail?: string;
              message?: string;
            };
          };
        }
      )?.response?.data;

      // Extract per-field errors from Django (e.g. { email: ["already exists"] })
      const extracted: Partial<Record<keyof RegisterPayload, string>> = {};
      (["name", "email", "password"] as (keyof RegisterPayload)[]).forEach((field) => {
        if (responseData?.[field]?.[0]) {
          extracted[field] = responseData[field]![0];
        }
      });

      if (Object.keys(extracted).length) {
        setFieldErrors(extracted);
      } else {
        setError(
          responseData?.detail ??
          responseData?.message ??
          "Registration failed. Please try again."
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

  return { register, loading, error, fieldErrors, reset };
};

export default useRegister;
