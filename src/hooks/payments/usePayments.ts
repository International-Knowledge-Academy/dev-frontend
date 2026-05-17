import { useState, useEffect, useCallback } from "react";
import axiosInstance from "api/axiosInstance";
import type { PaginatedPayments, Payment, PaymentsParams } from "types/payment";

interface UsePaymentsReturn {
  payments: Payment[];
  count: number;
  next: string | null;
  previous: string | null;
  loading: boolean;
  error: string | null;
  params: PaymentsParams;
  setParams: (updates: Partial<PaymentsParams>) => void;
  refetch: () => void;
}

const usePayments = (initialParams: PaymentsParams = {}): UsePaymentsReturn => {
  const [payments, setPayments]  = useState<Payment[]>([]);
  const [count, setCount]        = useState(0);
  const [next, setNext]          = useState<string | null>(null);
  const [previous, setPrevious]  = useState<string | null>(null);
  const [loading, setLoading]    = useState(false);
  const [error, setError]        = useState<string | null>(null);
  const [params, setParamsState] = useState<PaymentsParams>(initialParams);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.get<PaginatedPayments>("/payments", {
        params: {
          ...(params.page              && { page:              params.page }),
          ...(params.search            && { search:            params.search }),
          ...(params.ordering          && { ordering:          params.ordering }),
          ...(params.status            && { status:            params.status }),
          ...(params.sponsorship_type  && { sponsorship_type:  params.sponsorship_type }),
        },
      });
      setPayments(Array.isArray(data.results) ? data.results : []);
      setCount(data.count ?? 0);
      setNext(data.next ?? null);
      setPrevious(data.previous ?? null);
    } catch (err: unknown) {
      setError(
        (err as any)?.response?.data?.detail ??
        (err as any)?.response?.data?.message ??
        "Failed to load payments."
      );
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  const setParams = (updates: Partial<PaymentsParams>) => {
    setParamsState((prev) => ({
      ...prev,
      ...updates,
      page: "search" in updates || "ordering" in updates || "status" in updates || "sponsorship_type" in updates
        ? 1
        : (updates.page ?? prev.page),
    }));
  };

  return { payments, count, next, previous, loading, error, params, setParams, refetch: fetchPayments };
};

export default usePayments;
