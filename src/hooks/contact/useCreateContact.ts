import { useState } from "react";
import axiosInstance from "api/axiosInstance";
import type { Contact, CreateContactPayload } from "types/contact";

interface FieldErrors {
  full_name?:        string;
  organization?:     string;
  email?:            string;
  phone_whatsapp?:   string;
  program_category?: string;
  program_type?:     string;
  message?:          string;
}

interface UseCreateContactReturn {
  submitContact: (payload: CreateContactPayload) => Promise<Contact | void>;
  loading:       boolean;
  error:         string | null;
  fieldErrors:   FieldErrors;
  reset:         () => void;
}

const useCreateContact = (): UseCreateContactReturn => {
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const reset = () => {
    setError(null);
    setFieldErrors({});
  };

  const submitContact = async (payload: CreateContactPayload): Promise<Contact | void> => {
    setLoading(true);
    setError(null);
    setFieldErrors({});
    try {
      const { data } = await axiosInstance.post<Contact>("/contact", payload);
      return data;
    } catch (err: unknown) {
      const responseData = (err as any)?.response?.data;
      const fields: (keyof FieldErrors)[] = [
        "full_name", "organization", "email",
        "phone_whatsapp", "program_category", "program_type", "message",
      ];
      const extracted: FieldErrors = {};
      fields.forEach((field) => {
        const val = responseData?.[field];
        if (Array.isArray(val) && val[0]) extracted[field] = val[0];
        else if (typeof val === "string")  extracted[field] = val;
      });
      if (Object.keys(extracted).length) {
        setFieldErrors(extracted);
      } else {
        setError(
          responseData?.detail ??
          responseData?.message ??
          "Failed to submit your message. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return { submitContact, loading, error, fieldErrors, reset };
};

export default useCreateContact;
