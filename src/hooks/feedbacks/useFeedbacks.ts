import { useState, useEffect, useCallback } from "react";
import axiosInstance from "api/axiosInstance";
import type { PaginatedFeedbacks, Feedback, FeedbacksParams } from "types/feedback";

interface UseFeedbacksReturn {
  feedbacks: Feedback[];
  count: number;
  next: string | null;
  previous: string | null;
  loading: boolean;
  error: string | null;
  params: FeedbacksParams;
  setParams: (updates: Partial<FeedbacksParams>) => void;
  refetch: () => void;
}

const useFeedbacks = (initialParams: FeedbacksParams = {}): UseFeedbacksReturn => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [count, setCount]         = useState(0);
  const [next, setNext]           = useState<string | null>(null);
  const [previous, setPrevious]   = useState<string | null>(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [params, setParamsState]  = useState<FeedbacksParams>(initialParams);

  const fetchFeedbacks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.get<PaginatedFeedbacks>("/feedbacks", {
        params: {
          ...(params.page         && { page:         params.page }),
          ...(params.page_size    && { page_size:    params.page_size }),
          ...(params.search       && { search:       params.search }),
          ...(params.ordering     && { ordering:     params.ordering }),
          ...(params.email        && { email:        params.email }),
          ...(params.program__uid && { program__uid: params.program__uid }),
        },
      });
      setFeedbacks(Array.isArray(data.results) ? data.results : []);
      setCount(data.count ?? 0);
      setNext(data.next ?? null);
      setPrevious(data.previous ?? null);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { detail?: string; message?: string } } })
          ?.response?.data?.detail ??
        (err as { response?: { data?: { message?: string } } })
          ?.response?.data?.message ??
        "Failed to load feedbacks.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const setParams = (updates: Partial<FeedbacksParams>) => {
    setParamsState((prev) => ({
      ...prev,
      ...updates,
      page:
        "search"       in updates ||
        "ordering"     in updates ||
        "email"        in updates ||
        "program__uid" in updates
          ? 1
          : (updates.page ?? prev.page),
    }));
  };

  return { feedbacks, count, next, previous, loading, error, params, setParams, refetch: fetchFeedbacks };
};

export default useFeedbacks;
