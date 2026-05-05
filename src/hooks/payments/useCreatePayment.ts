import { useState } from "react";
import axiosInstance from "api/axiosInstance";
import type { Payment, CreatePaymentPayload, PaymentFieldErrors } from "types/payment";

interface UseCreatePaymentReturn {
  createPayment: (payload: CreatePaymentPayload) => Promise<Payment | void>;
  loading: boolean;
  error: string | null;
  fieldErrors: PaymentFieldErrors;
  reset: () => void;
}

const useCreatePayment = (): UseCreatePaymentReturn => {
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<PaymentFieldErrors>({});

  const createPayment = async (payload: CreatePaymentPayload): Promise<Payment | void> => {
    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const { data } = await axiosInstance.post<Payment>("/payments", payload);
      return data;
    } catch (err: unknown) {
      const responseData = (err as any)?.response?.data;

      const fields: (keyof CreatePaymentPayload)[] = [
        "sponsorship_type", "amount", "payment_method", "proof",
        "cancelled_at", "cancelled_reason", "registration",
        "approved_by", "cancelled_by",
      ];

      const extracted: PaymentFieldErrors = {};
      fields.forEach((f) => {
        const val = responseData?.[f];
        if (Array.isArray(val) && val[0]) extracted[f] = val[0];
      });

      if (Object.keys(extracted).length) {
        setFieldErrors(extracted);
      } else {
        setError(
          responseData?.detail ??
          responseData?.message ??
          "Failed to create payment. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setError(null); setFieldErrors({}); };

  return { createPayment, loading, error, fieldErrors, reset };
};

export default useCreatePayment;
