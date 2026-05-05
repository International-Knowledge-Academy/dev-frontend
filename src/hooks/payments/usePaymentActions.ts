import { useState } from "react";
import axiosInstance from "api/axiosInstance";

interface ActionState {
  loading: boolean;
  error: string | null;
}

interface UsePaymentActionsReturn {
  markPaid:   (id: number | string) => Promise<boolean>;
  markFailed: (id: number | string) => Promise<boolean>;
  markPaidState:   ActionState;
  markFailedState: ActionState;
}

const defaultState = (): ActionState => ({ loading: false, error: null });

const usePaymentActions = (): UsePaymentActionsReturn => {
  const [markPaidState,   setMarkPaidState]   = useState<ActionState>(defaultState());
  const [markFailedState, setMarkFailedState] = useState<ActionState>(defaultState());

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
        (err as any)?.response?.data?.message ??
        fallbackError;
      setState({ loading: false, error: msg });
      return false;
    }
  };

  const markPaid = (id: number | string) =>
    runAction(
      setMarkPaidState,
      () => axiosInstance.post(`/payments/${id}/mark_paid`),
      "Failed to mark payment as paid."
    );

  const markFailed = (id: number | string) =>
    runAction(
      setMarkFailedState,
      () => axiosInstance.post(`/payments/${id}/mark_failed`),
      "Failed to mark payment as failed."
    );

  return { markPaid, markFailed, markPaidState, markFailedState };
};

export default usePaymentActions;
