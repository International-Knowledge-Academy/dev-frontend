import { useState } from "react";
import axiosInstance from "api/axiosInstance";
import type { ChangePasswordPayload, ChangePasswordResponse } from "types/password";

interface UseChangePasswordReturn {
  changePassword: (payload: ChangePasswordPayload) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: string | null;
  reset: () => void;
}

const useChangePassword = (): UseChangePasswordReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const changePassword = async (payload: ChangePasswordPayload): Promise<void> => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { data } = await axiosInstance.post<ChangePasswordResponse>(
        "/auth/change_password",
        payload
      );
      setSuccess(data.message ?? "Password changed successfully.");
    } catch (err: unknown) {
      const responseData = (err as { response?: { data?: Record<string, string[]> & { detail?: string; message?: string } } })
        ?.response?.data;

      // Django may return field errors as { old_password: ["..."], new_password: ["..."] }
      const fieldError =
        responseData?.old_password?.[0] ??
        responseData?.new_password?.[0] ??
        responseData?.detail ??
        responseData?.message ??
        "Something went wrong. Please try again.";

      setError(fieldError);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setSuccess(null);
  };

  return { changePassword, loading, error, success, reset };
};

export default useChangePassword;
