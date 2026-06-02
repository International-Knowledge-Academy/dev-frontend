import { useState } from "react";
import axiosInstance from "api/axiosInstance";

interface UseDeletePaymentReturn {
  deletePayment: (id: number | string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

const useDeletePayment = (): UseDeletePaymentReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const deletePayment = async (id: number | string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.delete(`/payments/${id}`);
      return true;
    } catch (err: unknown) {
      setError(
        (err as any)?.response?.data?.detail ??
        (err as any)?.response?.data?.message ??
        "Failed to delete payment."
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deletePayment, loading, error };
};

export default useDeletePayment;
