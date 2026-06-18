import { useState } from "react";
import axiosInstance from "api/axiosInstance";
import type { CampRegistration } from "types/campRegistration";
import normalizeFieldErrors from "./normalizeFieldErrors";

type ActionFn = (uid: string) => Promise<CampRegistration | null>;

interface UseCampRegistrationActionsReturn {
  accept:            ActionFn;
  reject:            ActionFn;
  scheduleInterview: ActionFn;
  loading:           boolean;
  error:             string | null;
  fieldErrors:       Record<string, string[]> | null;
  clearErrors:       () => void;
}

const useCampRegistrationActions = (): UseCampRegistrationActionsReturn => {
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | null>(null);

  const action = async (uid: string, endpoint: string): Promise<CampRegistration | null> => {
    setLoading(true);
    setError(null);
    setFieldErrors(null);
    try {
      const { data } = await axiosInstance.post<CampRegistration>(
        `/registrations/camps/registrations/${uid}/${endpoint}`
      );
      return data;
    } catch (err: unknown) {
      const responseData = (err as any)?.response?.data;
      const normalized = normalizeFieldErrors(responseData);
      if (Object.keys(normalized).length && !responseData?.detail) {
        setFieldErrors(normalized);
      } else {
        setError(
          responseData?.detail ??
          responseData?.message ??
          "Action failed. Please try again."
        );
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearErrors = () => { setError(null); setFieldErrors(null); };

  return {
    accept:            (uid) => action(uid, "accept"),
    reject:            (uid) => action(uid, "reject"),
    scheduleInterview: (uid) => action(uid, "schedule-interview"),
    loading,
    error,
    fieldErrors,
    clearErrors,
  };
};

export default useCampRegistrationActions;
