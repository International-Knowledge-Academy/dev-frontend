import { useState } from "react";
import axiosInstance from "api/axiosInstance";

interface ActionState {
  loading: boolean;
  error: string | null;
}

interface UseRegistrationActionsReturn {
  approve:       (id: number | string) => Promise<boolean>;
  reject:        (id: number | string, reason?: string) => Promise<boolean>;
  assignManager: (id: number | string, managerId: number) => Promise<boolean>;
  approveState:       ActionState;
  rejectState:        ActionState;
  assignManagerState: ActionState;
}

const defaultState = (): ActionState => ({ loading: false, error: null });

const useRegistrationActions = (): UseRegistrationActionsReturn => {
  const [approveState,       setApproveState]       = useState<ActionState>(defaultState());
  const [rejectState,        setRejectState]        = useState<ActionState>(defaultState());
  const [assignManagerState, setAssignManagerState] = useState<ActionState>(defaultState());

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

  const approve = (id: number | string) =>
    runAction(
      setApproveState,
      () => axiosInstance.post(`/registrations/${id}/approve`),
      "Failed to approve registration."
    );

  const reject = (id: number | string, reason?: string) =>
    runAction(
      setRejectState,
      () => axiosInstance.post(`/registrations/${id}/reject`, reason ? { reason } : {}),
      "Failed to reject registration."
    );

  const assignManager = (id: number | string, managerId: number) =>
    runAction(
      setAssignManagerState,
      () => axiosInstance.post(`/registrations/${id}/assign_manager`, { manager_id: managerId }),
      "Failed to assign manager."
    );

  return {
    approve,
    reject,
    assignManager,
    approveState,
    rejectState,
    assignManagerState,
  };
};

export default useRegistrationActions;
