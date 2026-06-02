import { useState, useEffect } from "react";
import axiosInstance from "api/axiosInstance";
import type { Registration } from "types/registration";

interface UseGetRegistrationReturn {
  registration: Registration | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const useGetRegistration = (id: number | string | undefined): UseGetRegistrationReturn => {
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState<string | null>(null);

  const fetch = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.get<Registration>(`/registrations/${id}`);
      setRegistration(data);
    } catch (err: unknown) {
      setError(
        (err as any)?.response?.data?.detail ??
        (err as any)?.response?.data?.message ??
        "Failed to load registration."
      );
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetch(); }, [id]);

  return { registration, loading, error, refetch: fetch };
};

export default useGetRegistration;
