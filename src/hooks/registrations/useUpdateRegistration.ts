import { useState } from "react";
import axiosInstance from "api/axiosInstance";
import type { Registration, UpdateRegistrationPayload, RegistrationFieldErrors } from "types/registration";

interface UseUpdateRegistrationReturn {
  updateRegistration: (id: number | string, payload: UpdateRegistrationPayload) => Promise<Registration | void>;
  loading: boolean;
  error: string | null;
  fieldErrors: RegistrationFieldErrors;
  reset: () => void;
}

const useUpdateRegistration = (): UseUpdateRegistrationReturn => {
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<RegistrationFieldErrors>({});

  const updateRegistration = async (
    id: number | string,
    payload: UpdateRegistrationPayload
  ): Promise<Registration | void> => {
    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const { data } = await axiosInstance.patch<Registration>(`/registrations/${id}`, payload);
      return data;
    } catch (err: unknown) {
      const responseData = (err as any)?.response?.data;

      const fields: (keyof UpdateRegistrationPayload)[] = [
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
          "Failed to update registration. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setError(null); setFieldErrors({}); };

  return { updateRegistration, loading, error, fieldErrors, reset };
};

export default useUpdateRegistration;
