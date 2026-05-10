import { useState } from "react";
import axiosInstance from "api/axiosInstance";
import type { TrainerFieldErrors } from "types/trainer";

export interface ApplyAsTrainerPayload {
  name: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  title?: string;
  years_experience?: number;
  country?: string;
  city?: string;
  postal_code?: string;
  address?: string;
  primary_email?: string;
  secondary_email?: string;
  linkedin_url?: string;
  certifications?: string;
  bio?: string;
  profile_picture?: string;
  cv?: string;
}

export interface ApplyAsTrainerResult {
  ok: boolean;
  fieldErrors: TrainerFieldErrors;
  error: string | null;
}

interface UseApplyAsTrainerReturn {
  apply: (payload: ApplyAsTrainerPayload) => Promise<ApplyAsTrainerResult>;
  loading: boolean;
  error: string | null;
  fieldErrors: TrainerFieldErrors;
}

const useApplyAsTrainer = (): UseApplyAsTrainerReturn => {
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<TrainerFieldErrors>({});

  const apply = async (payload: ApplyAsTrainerPayload): Promise<ApplyAsTrainerResult> => {
    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const body: Partial<ApplyAsTrainerPayload> = {};
      (Object.keys(payload) as (keyof ApplyAsTrainerPayload)[]).forEach((key) => {
        const val = payload[key];
        if (val !== undefined && val !== null && val !== "") {
          (body as any)[key] = val;
        }
      });

      await axiosInstance.post("/trainers", body);
      return { ok: true, fieldErrors: {}, error: null };
    } catch (err: unknown) {
      const responseData = (err as any)?.response?.data;

      const fields: (keyof TrainerFieldErrors)[] = [
        "name", "email", "phone", "whatsapp", "title", "years_experience",
        "country", "city", "postal_code", "address", "primary_email", "secondary_email",
        "linkedin_url", "certifications", "bio", "profile_picture", "cv",
      ];
      const extracted: TrainerFieldErrors = {};
      fields.forEach((f) => {
        const val = responseData?.[f];
        if (Array.isArray(val) && val[0]) extracted[f] = val[0];
      });

      if (Object.keys(extracted).length) {
        setFieldErrors(extracted);
        return { ok: false, fieldErrors: extracted, error: null };
      }

      const generalError =
        responseData?.detail ??
        responseData?.message ??
        "Failed to submit application. Please try again.";
      setError(generalError);
      return { ok: false, fieldErrors: {}, error: generalError };
    } finally {
      setLoading(false);
    }
  };

  return { apply, loading, error, fieldErrors };
};

export default useApplyAsTrainer;
