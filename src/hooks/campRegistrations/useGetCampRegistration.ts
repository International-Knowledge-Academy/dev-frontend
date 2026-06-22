import { useState, useEffect, useCallback } from "react";
import axiosInstance from "api/axiosInstance";
import type { CampRegistration } from "types/campRegistration";

const useGetCampRegistration = (uid: string | undefined) => {
  const [registration, setRegistration] = useState<CampRegistration | null>(null);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!uid) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.get<CampRegistration>(
        `/camps/registrations/${uid}`
      );
      setRegistration(data);
    } catch (err: unknown) {
      setError(
        (err as any)?.response?.data?.detail ??
        (err as any)?.response?.data?.message ??
        "Failed to load camp registration."
      );
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => { fetch(); }, [fetch]);

  return { registration, loading, error, refetch: fetch };
};

export default useGetCampRegistration;
