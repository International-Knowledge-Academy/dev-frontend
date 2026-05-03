import { useState } from "react";
import axiosInstance from "api/axiosInstance";
import type { User } from "types/auth";
import type { UpdateProfilePayload } from "types/user";

export type { UpdateProfilePayload };

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
        `/auth/users/${uid}`,
        { profile: payload }
      );
      return data;
    } catch (err: unknown) {
      const responseData = (err as { response?: { data?: any } })?.response?.data;
      const profileErrors = responseData?.profile ?? responseData;

      const fields: (keyof UpdateProfilePayload)[] = [
        "profile_picture", "cv", "title", "bio", "years_experience", "certifications",
        "linkedin_url", "primary_email", "secondary_email", "address", "country",
        "city", "postal_code", "phone", "whatsapp", "specializations",
      ];

      const extracted: FieldErrors = {};
      fields.forEach((field) => {
        const val = profileErrors?.[field];
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
