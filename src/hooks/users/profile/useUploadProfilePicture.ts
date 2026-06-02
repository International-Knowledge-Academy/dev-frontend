import { useState } from "react";
import axiosInstance from "api/axiosInstance";
import type { User } from "types/auth";

interface UseUploadProfilePictureReturn {
  uploadProfilePicture: (uid: string, file: File) => Promise<User | void>;
  loading: boolean;
  error: string | null;
}

const useUploadProfilePicture = (): UseUploadProfilePictureReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const uploadProfilePicture = async (uid: string, file: File): Promise<User | void> => {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("profile_picture", file);

    try {
      const { data } = await axiosInstance.post<User>(
        `/auth/users/${uid}/upload_profile_picture`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return data;
    } catch (err: unknown) {
      const responseData = (err as { response?: { data?: any } })?.response?.data;
      setError(
        responseData?.detail ??
        responseData?.message ??
        "Failed to upload profile picture."
      );
    } finally {
      setLoading(false);
    }
  };

  return { uploadProfilePicture, loading, error };
};

export default useUploadProfilePicture;
