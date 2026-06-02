import { useState, useEffect } from "react";
import axiosInstance from "api/axiosInstance";
import type { Payment } from "types/payment";

interface UseGetPaymentReturn {
  payment: Payment | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const useGetPayment = (id: number | string | undefined): UseGetPaymentReturn => {
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const fetch = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.get<Payment>(`/payments/${id}`);
      setPayment(data);
    } catch (err: unknown) {
      setError(
        (err as any)?.response?.data?.detail ??
        (err as any)?.response?.data?.message ??
        "Failed to load payment."
      );
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetch(); }, [id]);

  return { payment, loading, error, refetch: fetch };
};

export default useGetPayment;
