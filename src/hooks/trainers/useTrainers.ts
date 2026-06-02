import { useState, useEffect, useCallback } from "react";
import axiosInstance from "api/axiosInstance";
import type { TrainerBrief, TrainersParams } from "types/trainer";

interface UseTrainersReturn {
  trainers: TrainerBrief[];
  count: number;
  loading: boolean;
  error: string | null;
  params: TrainersParams;
  setParams: (updates: Partial<TrainersParams>) => void;
  refetch: () => void;
}

const useTrainers = (initial: TrainersParams = {}): UseTrainersReturn => {
  const [trainers, setTrainers] = useState<TrainerBrief[]>([]);
  const [count, setCount]       = useState(0);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [params, setParamsState] = useState<TrainersParams>({ page: 1, ...initial });

  const setParams = useCallback((updates: Partial<TrainersParams>) => {
    setParamsState((p) => ({ ...p, ...updates }));
  }, []);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams();
      if (params.page)    query.set("page",     String(params.page));
      if (params.search)  query.set("search",   params.search);
      if (params.ordering) query.set("ordering", params.ordering);

      const { data } = await axiosInstance.get(`/trainers?${query.toString()}`);
      setTrainers(data.results ?? []);
      setCount(data.count ?? 0);
    } catch {
      setError("Failed to load trainers.");
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => { fetch(); }, [fetch]);

  return { trainers, count, loading, error, params, setParams, refetch: fetch };
};

export default useTrainers;
