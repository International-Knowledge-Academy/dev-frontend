import { useState, useEffect } from "react";
import axiosInstance from "api/axiosInstance";
import type { User } from "types/auth";

interface UseGetUserReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const useGetUser = (id: string | number): UseGetUserReturn => {
  const [user, setUser]     = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const fetchUser = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);

    try {
      const { data } = await axiosInstance.get<User>(`/auth/users/${id}`);
      setUser(data);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { detail?: string; message?: string } } })
          ?.response?.data?.detail ??
        (err as { response?: { data?: { message?: string } } })
          ?.response?.data?.message ??
        "Failed to load user.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return { user, loading, error, refetch: fetchUser };
};

export default useGetUser;
