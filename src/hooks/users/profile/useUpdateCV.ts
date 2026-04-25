import { useState } from "react";
import axiosInstance from "api/axiosInstance";
import type { User } from "types/auth";

interface UseUpdateCVReturn {
  updateCV: (uid: string, file: File) => Promise<User | void>;
  loading: boolean;
  error: string | null;
}

const useUpdateCV = (): UseUpdateCVReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const updateCV = async (uid: string, file: File): Promise<User | void> => {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("cv", file);

    try {
      const { data } = await axiosInstance.put<User>(
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
        "Failed to update CV."
      );
    } finally {
      setLoading(false);
    }
  };

  return { updateCV, loading, error };
};

export default useUpdateCV;
