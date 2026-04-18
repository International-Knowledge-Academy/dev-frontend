import { useState, useEffect } from "react";
import authApi from "api/auth";
import type { User } from "types/auth";

interface UseMeReturn {
  me: User | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const useMe = (): UseMeReturn => {
  const [me, setMe]           = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const fetchMe = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await authApi.getMe();
      setMe(data);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { detail?: string } } })
          ?.response?.data?.detail ?? "Failed to load user.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  return { me, loading, error, refetch: fetchMe };
};

export default useMe;
