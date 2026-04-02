import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "api/auth";
import useAuth from "hooks/auth/useAuth";
import type { LoginPayload } from "types/auth";

interface UseLoginReturn {
  login: (payload: LoginPayload) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const useLogin = (): UseLoginReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const navigate = useNavigate();
  const { setUserFromData } = useAuth();

  const login = async ({ email, password }: LoginPayload): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Step 1 — obtain tokens
      const { data: tokens } = await authApi.login(email, password);
      localStorage.setItem("access", tokens.access);
      localStorage.setItem("refresh", tokens.refresh);

      // Step 2 — fetch current user and hydrate AuthContext
      const { data: me } = await authApi.getMe();
      setUserFromData(me);

      const roleRedirect: Record<string, string> = {
        admin:           "/admin",
        account_manager: "/account-manager",
      };
      navigate(roleRedirect[me.role] ?? "/");
    } catch (err: unknown) {
      console.error("❌ Login failed:", err);
      const message =
        (err as { response?: { data?: { detail?: string; message?: string } } })
          ?.response?.data?.detail ??
        (err as { response?: { data?: { message?: string } } })
          ?.response?.data?.message ??
        "Invalid credentials.";
      setError(message);
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};

export default useLogin;
