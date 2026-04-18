import { useState } from "react";
import axiosInstance from "api/axiosInstance";
import type { User } from "types/auth";

interface UseUploadCVReturn {
  uploadCV: (uid: string, file: File) => Promise<User | void>;
  loading: boolean;
  error: string | null;
}

const useUploadCV = (): UseUploadCVReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const uploadCV = async (uid: string, file: File): Promise<User | void> => {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("cv", file);

    try {
      const { data } = await axiosInstance.post<User>(
        `/auth/users/${uid}/upload_cv`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return data;
    } catch (err: unknown) {
      const responseData = (err as { response?: { data?: any } })?.response?.data;
      setError(
        responseData?.detail ??
        responseData?.message ??
        "Failed to upload CV. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return { uploadCV, loading, error };
};

export default useUploadCV;
