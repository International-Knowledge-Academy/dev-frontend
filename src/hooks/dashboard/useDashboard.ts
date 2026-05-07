import { useState, useEffect, useCallback } from "react";
import axiosInstance from "api/axiosInstance";
import type { DashboardData } from "types/dashboard";

interface UseDashboardReturn {
  data:    DashboardData | null;
  loading: boolean;
  error:   string | null;
  refetch: () => void;
}

const useDashboard = (): UseDashboardReturn => {
  const [data,    setData]    = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: res } = await axiosInstance.get<DashboardData>("/dashboard");
      setData(res);
    } catch (err: unknown) {
      setError(
        (err as any)?.response?.data?.detail ??
        (err as any)?.response?.data?.message ??
        "Failed to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
};

export default useDashboard;
