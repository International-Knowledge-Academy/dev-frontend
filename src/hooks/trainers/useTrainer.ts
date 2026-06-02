import { useState, useEffect, useCallback } from "react";
import axiosInstance from "api/axiosInstance";
import type { Trainer } from "types/trainer";

interface UseTrainerReturn {
  trainer: Trainer | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const useTrainer = (uid: string | undefined): UseTrainerReturn => {
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!uid) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.get<Trainer>(`/trainers/${uid}`);
      setTrainer(data);
    } catch {
      setError("Failed to load trainer.");
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => { fetch(); }, [fetch]);

  return { trainer, loading, error, refetch: fetch };
};

export default useTrainer;
