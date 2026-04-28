import { useState } from "react";
import axiosInstance from "api/axiosInstance";
import type { ProgramTrainerAssignment } from "types/programTrainer";

interface AssignTrainerPayload {
  trainer_profile: string;
  program: string;
  is_lead_instructor?: boolean;
  notes?: string;
}

type AssignTrainerFieldErrors = Partial<Record<keyof AssignTrainerPayload, string>>;

interface UseAssignTrainerReturn {
  assign: (payload: AssignTrainerPayload) => Promise<ProgramTrainerAssignment | void>;
  loading: boolean;
  error: string | null;
  fieldErrors: AssignTrainerFieldErrors;
  reset: () => void;
}

const useAssignTrainer = (): UseAssignTrainerReturn => {
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<AssignTrainerFieldErrors>({});

  const assign = async (payload: AssignTrainerPayload): Promise<ProgramTrainerAssignment | void> => {
    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const { data } = await axiosInstance.post<ProgramTrainerAssignment>(
        "/program-trainers/assign",
        payload
      );
      return data;
    } catch (err: unknown) {
      const responseData = (err as { response?: { data?: any } })?.response?.data;

      const fields: (keyof AssignTrainerPayload)[] = [
        "trainer_profile", "program", "is_lead_instructor", "notes",
      ];
      const extracted: AssignTrainerFieldErrors = {};
      fields.forEach((field) => {
        const val = responseData?.[field];
        if (Array.isArray(val) && val[0]) extracted[field] = val[0];
      });

      if (Object.keys(extracted).length) {
        setFieldErrors(extracted);
      } else {
        setError(
          responseData?.detail ??
          responseData?.message ??
          "Failed to assign trainer. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setFieldErrors({});
  };

  return { assign, loading, error, fieldErrors, reset };
};

export default useAssignTrainer;
