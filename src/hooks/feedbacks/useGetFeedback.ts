import { useState, useEffect } from "react";
import axiosInstance from "api/axiosInstance";
import type { Feedback } from "types/feedback";

interface UseGetFeedbackReturn {
  feedback: Feedback | null;
  loading: boolean;
  error: string | null;
}

const useGetFeedback = (uid: string | undefined): UseGetFeedbackReturn => {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    if (!uid) return;
    setLoading(true);
    setError(null);
    axiosInstance
      .get<Feedback>(`/feedbacks/${uid}`)
      .then(({ data }) => setFeedback(data))
      .catch((err) => {
        const responseData = err?.response?.data;
        setError(responseData?.detail ?? responseData?.message ?? "Failed to load feedback.");
      })
      .finally(() => setLoading(false));
  }, [uid]);

  return { feedback, loading, error };
};

export default useGetFeedback;
