import { useState } from "react";
import axiosInstance from "api/axiosInstance";
import type { Program, CreateProgramPayload, ProgramFieldErrors } from "types/program";

interface UseCreateProgramReturn {
  createProgram: (payload: CreateProgramPayload) => Promise<Program | void>;
  loading: boolean;
  error: string | null;
  fieldErrors: ProgramFieldErrors;
  reset: () => void;
}

const useCreateProgram = (): UseCreateProgramReturn => {
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ProgramFieldErrors>({});

  const createProgram = async (payload: CreateProgramPayload): Promise<Program | void> => {
    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const { data } = await axiosInstance.post<Program>("/programs", payload);
      return data;
    } catch (err: unknown) {
      const responseData = (err as any)?.response?.data;

      const fields: (keyof CreateProgramPayload)[] = [
        "name", "description", "objectives", "target_audience", "prerequisites",
        "field", "location", "trainer_profiles", "program_type", "duration",
        "level", "mode", "language", "start_date", "end_date",
        "max_participants", "brochure_url", "contact_email", "contact_phone",
        "status", "is_active", "thumbnail", "price", "currency",
      ];

      const extracted: ProgramFieldErrors = {};
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
          "Failed to create program. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setError(null); setFieldErrors({}); };

  return { createProgram, loading, error, fieldErrors, reset };
};

export default useCreateProgram;
