import { useState } from "react";
import axiosInstance from "api/axiosInstance";

interface ActionState {
  loading: boolean;
  error: string | null;
}

interface UsePaymentActionsReturn {
  markPaid:      (id: string) => Promise<boolean>;
  markCancelled: (id: string, reason: string) => Promise<boolean>;
  markRefunded:  (id: string, reason: string) => Promise<boolean>;
  markPaidState:      ActionState;
  markCancelledState: ActionState;
  markRefundedState:  ActionState;
}

const defaultState = (): ActionState => ({ loading: false, error: null });

const usePaymentActions = (): UsePaymentActionsReturn => {
  const [markPaidState,      setMarkPaidState]      = useState<ActionState>(defaultState());
  const [markCancelledState, setMarkCancelledState] = useState<ActionState>(defaultState());
  const [markRefundedState,  setMarkRefundedState]  = useState<ActionState>(defaultState());

  const runAction = async (
    setState: React.Dispatch<React.SetStateAction<ActionState>>,
    request: () => Promise<void>,
    fallbackError: string
  ): Promise<boolean> => {
    setState({ loading: true, error: null });
    try {
      await request();
      setState({ loading: false, error: null });
      return true;
    } catch (err: unknown) {
      const msg =
        (err as any)?.response?.data?.detail ??
        (err as any)?.response?.data?.error ??
        (err as any)?.response?.data?.message ??
        fallbackError;
      setState({ loading: false, error: msg });
      return false;
    }
  };

  const markPaid = (id: string) =>
    runAction(
      setMarkPaidState,
      () => axiosInstance.post(`/payments/${id}/mark_paid`),
      "Failed to mark payment as paid."
    );

  const markCancelled = (id: string, reason: string) =>
    runAction(
      setMarkCancelledState,
      () => axiosInstance.post(`/payments/${id}/mark_cancelled`, { reason }),
      "Failed to cancel payment."
    );

  const markRefunded = (id: string, reason: string) =>
    runAction(
      setMarkRefundedState,
      () => axiosInstance.post(`/payments/${id}/mark_refunded`, { reason }),
      "Failed to mark payment as refunded."
    );

  return { markPaid, markCancelled, markRefunded, markPaidState, markCancelledState, markRefundedState };
};

export default usePaymentActions;
