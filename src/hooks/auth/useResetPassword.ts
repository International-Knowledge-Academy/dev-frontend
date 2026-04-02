import { useState } from "react";
import axiosInstance from "api/axiosInstance";
import type { ResetPasswordPayload, ResetPasswordResponse } from "types/password";

interface UseResetPasswordReturn {
  resetPassword: (payload: ResetPasswordPayload) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: string | null;
  reset: () => void;
}

const useResetPassword = (): UseResetPasswordReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const resetPassword = async (payload: ResetPasswordPayload): Promise<void> => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { data } = await axiosInstance.post<ResetPasswordResponse>(
        "/auth/reset-password/",
        payload
      );
      setSuccess(data.message ?? "Password reset successfully.");
    } catch (err: unknown) {
      const responseData = (
        err as {
          response?: {
            data?: {
              token?: string[];
              password?: string[];
              detail?: string;
              message?: string;
            };
          };
        }
      )?.response?.data;

      const message =
        responseData?.token?.[0] ??
        responseData?.password?.[0] ??
        responseData?.detail ??
        responseData?.message ??
        "Invalid or expired token. Please request a new reset link.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setSuccess(null);
  };

  return { resetPassword, loading, error, success, reset };
};

export default useResetPassword;
