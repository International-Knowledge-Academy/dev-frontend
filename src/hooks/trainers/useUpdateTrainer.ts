import { useState } from "react";
import axiosInstance from "api/axiosInstance";
import type { Trainer, UpdateTrainerPayload, TrainerFieldErrors } from "types/trainer";

interface UseUpdateTrainerReturn {
  updateTrainer: (uid: string, payload: UpdateTrainerPayload) => Promise<Trainer | null>;
  loading: boolean;
  error: string | null;
  fieldErrors: TrainerFieldErrors;
  reset: () => void;
}

const useUpdateTrainer = (): UseUpdateTrainerReturn => {
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<TrainerFieldErrors>({});

  const updateTrainer = async (uid: string, payload: UpdateTrainerPayload): Promise<Trainer | null> => {
    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const { data } = await axiosInstance.patch<Trainer>(`/trainers/${uid}`, payload);
      return data;
    } catch (err: unknown) {
      const responseData = (err as any)?.response?.data;

      const fields: (keyof UpdateTrainerPayload)[] = [
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
          "Failed to update trainer. Please try again."
        );
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setError(null); setFieldErrors({}); };

  return { updateTrainer, loading, error, fieldErrors, reset };
};

export default useUpdateTrainer;
