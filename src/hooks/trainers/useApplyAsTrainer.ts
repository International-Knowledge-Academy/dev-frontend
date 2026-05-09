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
  linkedin_url?: string;
  certifications?: string;
  bio?: string;
  profile_picture?: File | null;
  cv?: File | null;
}

interface UseApplyAsTrainerReturn {
  apply: (payload: ApplyAsTrainerPayload) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  fieldErrors: TrainerFieldErrors;
}

const useApplyAsTrainer = (): UseApplyAsTrainerReturn => {
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<TrainerFieldErrors>({});

  const apply = async (payload: ApplyAsTrainerPayload): Promise<boolean> => {
    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const form = new FormData();

      (Object.keys(payload) as (keyof ApplyAsTrainerPayload)[]).forEach((key) => {
        const val = payload[key];
        if (val === undefined || val === null || val === "") return;
        if (val instanceof File) {
          form.append(key, val);
        } else {
          form.append(key, String(val));
        }
      });

      await axiosInstance.post("/trainers", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return true;
    } catch (err: unknown) {
      const responseData = (err as any)?.response?.data;

      const fields: (keyof TrainerFieldErrors)[] = [
        "name", "email", "phone", "whatsapp", "title", "years_experience",
        "country", "city", "postal_code", "address", "primary_email",
        "linkedin_url", "certifications", "bio", "profile_picture", "cv",
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
