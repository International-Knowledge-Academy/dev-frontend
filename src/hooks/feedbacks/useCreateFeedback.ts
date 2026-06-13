import { useState } from "react";
import axiosInstance from "api/axiosInstance";
import type { Feedback, CreateFeedbackPayload } from "types/feedback";

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
  rating?: string;
  position?: string;
  program_uid?: string;
}

export interface CreateFeedbackResult {
  feedback: Feedback | null;
  fieldErrors: FieldErrors;
  error: string | null;
}

interface UseCreateFeedbackReturn {
  createFeedback: (payload: CreateFeedbackPayload) => Promise<CreateFeedbackResult>;
  loading: boolean;
  error: string | null;
  fieldErrors: FieldErrors;
}

const useCreateFeedback = (): UseCreateFeedbackReturn => {
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const createFeedback = async (payload: CreateFeedbackPayload): Promise<CreateFeedbackResult> => {
    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const { data } = await axiosInstance.post<Feedback>("/feedbacks", payload);
      return { feedback: data, fieldErrors: {}, error: null };
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
        return { feedback: null, fieldErrors: extracted, error: null };
      }

      const generalError =
        responseData?.detail ??
        responseData?.message ??
        "Failed to create feedback. Please try again.";
      setError(generalError);
      return { feedback: null, fieldErrors: {}, error: generalError };
    } finally {
      setLoading(false);
    }
  };

  return { createFeedback, loading, error, fieldErrors };
};

export default useCreateFeedback;
