import { useState } from "react";
import axiosInstance from "api/axiosInstance";

interface UseDeleteProfilePictureReturn {
  deleteProfilePicture: (uid: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

const useDeleteProfilePicture = (): UseDeleteProfilePictureReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const deleteProfilePicture = async (uid: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await axiosInstance.delete(`/auth/users/${uid}/upload_profile_picture`);
      return true;
    } catch (err: unknown) {
      const responseData = (err as { response?: { data?: any } })?.response?.data;
      setError(
        responseData?.detail ??
        responseData?.message ??
        "Failed to delete profile picture."
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteProfilePicture, loading, error };
};

export default useDeleteProfilePicture;
