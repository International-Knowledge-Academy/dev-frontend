import { useState } from "react";
import axiosInstance from "api/axiosInstance";

export interface TrainerApplicationPayload {
  full_name: string;
  email: string;
  phone: string;
  job_title?: string;
  years_of_experience?: string;
  expertise_areas?: string;
  bio?: string;
  linkedin_url?: string;
}

type FieldErrors = Partial<Record<keyof TrainerApplicationPayload, string>>;

interface UseApplyAsTrainerReturn {
  apply: (payload: TrainerApplicationPayload) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  fieldErrors: FieldErrors;
}

const useApplyAsTrainer = (): UseApplyAsTrainerReturn => {
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const apply = async (payload: TrainerApplicationPayload): Promise<boolean> => {
    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      await axiosInstance.post("/trainers/apply", payload);
      return true;
    } catch (err: unknown) {
      const responseData = (err as any)?.response?.data;

      const fields: (keyof TrainerApplicationPayload)[] = [
        "full_name", "email", "phone", "job_title",
        "years_of_experience", "expertise_areas", "bio", "linkedin_url",
      ];
      const extracted: FieldErrors = {};
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
          "Failed to submit application. Please try again."
        );
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { apply, loading, error, fieldErrors };
};

export default useApplyAsTrainer;
