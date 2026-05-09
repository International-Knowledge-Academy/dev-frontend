import { useState } from "react";
import axiosInstance from "api/axiosInstance";
import type { Trainer, CreateTrainerPayload, TrainerFieldErrors } from "types/trainer";

interface UseCreateTrainerReturn {
  createTrainer: (payload: CreateTrainerPayload) => Promise<Trainer | null>;
  loading: boolean;
  error: string | null;
  fieldErrors: TrainerFieldErrors;
  reset: () => void;
}

const useCreateTrainer = (): UseCreateTrainerReturn => {
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<TrainerFieldErrors>({});

  const createTrainer = async (payload: CreateTrainerPayload): Promise<Trainer | null> => {
    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const { data } = await axiosInstance.post<Trainer>("/trainers", payload);
      return data;
    } catch (err: unknown) {
      const responseData = (err as any)?.response?.data;

      const fields: (keyof CreateTrainerPayload)[] = [
        "name", "email", "profile_picture", "cv", "phone", "bio", "title",
        "years_experience", "certifications", "linkedin_url", "primary_email",
        "secondary_email", "address", "country", "city", "postal_code", "whatsapp",
      ];
      const extracted: TrainerFieldErrors = {};
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
          "Failed to create trainer. Please try again."
        );
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setError(null); setFieldErrors({}); };

  return { createTrainer, loading, error, fieldErrors, reset };
};

export default useCreateTrainer;
