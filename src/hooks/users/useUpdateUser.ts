import { useState, useRef } from "react";
import axiosInstance from "api/axiosInstance";
import type { User } from "types/auth";
import type { UpdateUserPayload, UpdateUserFieldErrors, UpdateProfilePayload } from "types/user";

type UpdateUserProfileFieldErrors = Partial<Record<keyof UpdateProfilePayload, string>>;

interface LastError {
  fieldErrors: UpdateUserFieldErrors;
  profileFieldErrors: UpdateUserProfileFieldErrors;
  error: string | null;
}

interface UseUpdateUserReturn {
  updateUser: (id: string | number, payload: UpdateUserPayload) => Promise<User | null>;
  loading: boolean;
  error: string | null;
  fieldErrors: UpdateUserFieldErrors;
  profileFieldErrors: UpdateUserProfileFieldErrors;
  reset: () => void;
  getLastError: () => LastError;
}

const useUpdateUser = (): UseUpdateUserReturn => {
  const [loading, setLoading]                       = useState(false);
  const [error, setError]                           = useState<string | null>(null);
  const [fieldErrors, setFieldErrors]               = useState<UpdateUserFieldErrors>({});
  const [profileFieldErrors, setProfileFieldErrors] = useState<UpdateUserProfileFieldErrors>({});
  const lastErrorRef = useRef<LastError>({ fieldErrors: {}, profileFieldErrors: {}, error: null });

  const updateUser = async (
    id: string | number,
    payload: UpdateUserPayload
  ): Promise<User | null> => {
    setLoading(true);
    setError(null);
    setFieldErrors({});
    setProfileFieldErrors({});
    lastErrorRef.current = { fieldErrors: {}, profileFieldErrors: {}, error: null };

    try {
      const { data } = await axiosInstance.put<User>(`/auth/users/${id}`, payload);
      return data;
    } catch (err: unknown) {
      const responseData = (err as { response?: { data?: any } })?.response?.data;

      const accountFields: (keyof UpdateUserPayload)[] = [
        "email", "password", "name", "role",
        "is_active", "is_staff", "is_superuser",
        "groups", "user_permissions",
      ];
      const extracted: UpdateUserFieldErrors = {};
      accountFields.forEach((field) => {
        const val = responseData?.[field];
        if (Array.isArray(val) && val[0]) extracted[field] = val[0];
      });

      const profileFields: (keyof UpdateProfilePayload)[] = [
        "profile_picture", "cv", "title", "bio", "years_experience",
        "certifications", "linkedin_url", "primary_email", "secondary_email",
        "address", "country", "city", "postal_code", "phone", "whatsapp",
      ];
      const extractedProfile: UpdateUserProfileFieldErrors = {};
      profileFields.forEach((field) => {
        const val = responseData?.profile?.[field];
        if (Array.isArray(val) && val[0]) extractedProfile[field] = val[0];
      });

      const hasErrors = Object.keys(extracted).length || Object.keys(extractedProfile).length;

      if (hasErrors) {
        setFieldErrors(extracted);
        setProfileFieldErrors(extractedProfile);
        lastErrorRef.current = { fieldErrors: extracted, profileFieldErrors: extractedProfile, error: null };
      } else {
        const generalError =
          responseData?.detail ??
          responseData?.message ??
          "Failed to update user. Please try again.";
        setError(generalError);
        lastErrorRef.current = { fieldErrors: {}, profileFieldErrors: {}, error: generalError };
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setFieldErrors({});
    setProfileFieldErrors({});
  };

  return { updateUser, loading, error, fieldErrors, profileFieldErrors, reset, getLastError: () => lastErrorRef.current };
};

export default useUpdateUser;
