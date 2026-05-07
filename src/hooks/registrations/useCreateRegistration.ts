import { useState } from "react";
import axiosInstance from "api/axiosInstance";
import type { Registration, CreateRegistrationPayload, RegistrationFieldErrors } from "types/registration";

interface UseCreateRegistrationReturn {
  createRegistration: (payload: CreateRegistrationPayload) => Promise<Registration | void>;
  loading: boolean;
  error: string | null;
  fieldErrors: RegistrationFieldErrors;
  reset: () => void;
}

const useCreateRegistration = (): UseCreateRegistrationReturn => {
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<RegistrationFieldErrors>({});

  const createRegistration = async (payload: CreateRegistrationPayload): Promise<Registration | void> => {
    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const { data } = await axiosInstance.post<Registration>("/registrations", payload);
      return data;
    } catch (err: unknown) {
      const responseData = (err as any)?.response?.data;

      const fields: (keyof CreateRegistrationPayload)[] = [
        "program_uid", "registration_type", "full_name", "email", "phone",
        "job_title", "address", "admin_notes", "certificate_issued", "certificate_issue_date",
      ];

      const extracted: RegistrationFieldErrors = {};
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
          "Failed to create registration. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setError(null); setFieldErrors({}); };

  return { createRegistration, loading, error, fieldErrors, reset };
};

export default useCreateRegistration;
