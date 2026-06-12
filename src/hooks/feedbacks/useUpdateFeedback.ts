import { useState, useRef } from "react";
import axiosInstance from "api/axiosInstance";
import type { Feedback, UpdateFeedbackPayload } from "types/feedback";

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
  rating?: string;
  position?: string;
  program_uid?: string;
}

interface LastError {
  fieldErrors: FieldErrors;
  error: string | null;
}

interface UseUpdateFeedbackReturn {
  updateFeedback: (uid: string, payload: UpdateFeedbackPayload) => Promise<Feedback | null>;
  loading: boolean;
  error: string | null;
  fieldErrors: FieldErrors;
  reset: () => void;
  getLastError: () => LastError;
}

const useUpdateFeedback = (): UseUpdateFeedbackReturn => {
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const lastErrorRef                  = useRef<LastError>({ fieldErrors: {}, error: null });

  const updateFeedback = async (uid: string, payload: UpdateFeedbackPayload): Promise<Feedback | null> => {
    setLoading(true);
    setError(null);
    setFieldErrors({});
    lastErrorRef.current = { fieldErrors: {}, error: null };

    try {
      const { data } = await axiosInstance.patch<Feedback>(`/feedbacks/${uid}`, payload);
      return data;
    } catch (err: unknown) {
      const responseData = (err as { response?: { data?: any } })?.response?.data;

      const fields: (keyof FieldErrors)[] = ["name", "email", "message", "rating", "position", "program_uid"];
      const extracted: FieldErrors = {};
      fields.forEach((field) => {
        const val = responseData?.[field];
        if (Array.isArray(val) && val[0]) extracted[field] = val[0];
      });

      if (Object.keys(extracted).length) {
        setFieldErrors(extracted);
        lastErrorRef.current = { fieldErrors: extracted, error: null };
      } else {
        const generalError =
          responseData?.detail ??
          responseData?.message ??
          "Failed to update feedback. Please try again.";
        setError(generalError);
        lastErrorRef.current = { fieldErrors: {}, error: generalError };
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setError(null); setFieldErrors({}); };

  return { updateFeedback, loading, error, fieldErrors, reset, getLastError: () => lastErrorRef.current };
};

export default useUpdateFeedback;
