import { useState, useEffect, useCallback } from "react";
import axiosInstance from "api/axiosInstance";
import type { Camp } from "types/camp";

const useGetCamp = (uid: string | undefined) => {
  const [camp, setCamp]     = useState<Camp | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!uid) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.get<Camp>(`/camps/${uid}`);
      setCamp(data);
    } catch (err: unknown) {
      setError(
        (err as any)?.response?.data?.detail ??
        (err as any)?.response?.data?.message ??
        "Failed to load camp."
      );
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => { fetch(); }, [fetch]);

  return { camp, loading, error, refetch: fetch };
};

export default useGetCamp;
