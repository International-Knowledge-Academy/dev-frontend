import { useState } from "react";
import axiosInstance from "api/axiosInstance";
import type { User } from "types/auth";

export interface UpdateProfilePayload {
  profile_picture?: string;
  title?: string;
  bio?: string;
  years_experience?: number | null;
  certifications?: string;
  linkedin_url?: string;
  primary_email?: string;
  secondary_email?: string;
  address?: string;
  country?: string;
  city?: string;
  postal_code?: string;
  phone?: string;
  whatsapp?: string;
}

type FieldErrors = Partial<Record<keyof UpdateProfilePayload, string>>;

interface UseUpdateProfileReturn {
  updateProfile: (uid: string, payload: UpdateProfilePayload) => Promise<User | void>;
  loading: boolean;
  error: string | null;
  fieldErrors: FieldErrors;
}

const useUpdateProfile = (): UseUpdateProfileReturn => {
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const updateProfile = async (uid: string, payload: UpdateProfilePayload): Promise<User | void> => {
    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const { data } = await axiosInstance.patch<User>(
        `/auth/users/${uid}/update_profile`,
        payload
      );
      return data;
    } catch (err: unknown) {
      const responseData = (err as { response?: { data?: any } })?.response?.data;

      const fields: (keyof UpdateProfilePayload)[] = [
        "profile_picture", "title", "bio", "years_experience", "certifications",
        "linkedin_url", "primary_email", "secondary_email", "address", "country",
        "city", "postal_code", "phone", "whatsapp",
      ];

      const extracted: FieldErrors = {};
      fields.forEach((field) => {
        const val = responseData?.[field];
        if (Array.isArray(val) && val[0]) extracted[field] = val[0];
      });

      if (Object.keys(extracted).length) {
        setFieldErrors(extracted);
      } else {
        setError(responseData?.detail ?? responseData?.message ?? "Failed to update profile.");
      }
    } finally {
      setLoading(false);
    }
  };

  return { updateProfile, loading, error, fieldErrors };
};

export default useUpdateProfile;
