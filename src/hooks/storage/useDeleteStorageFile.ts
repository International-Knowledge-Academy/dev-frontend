import { useState } from "react";
import axiosInstance from "api/axiosInstance";

interface UseDeleteStorageFileReturn {
  deleteFile: (file_key: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  reset: () => void;
}

const useDeleteStorageFile = (): UseDeleteStorageFileReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const deleteFile = async (file_key: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await axiosInstance.delete("/storage/file", { data: { file_key } });
      return true;
    } catch (err: unknown) {
      const responseData = (err as { response?: { data?: any } })?.response?.data;
      setError(
        responseData?.detail ??
        responseData?.message ??
        "Failed to delete file. Please try again."
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setError(null);
  };

  return { deleteFile, loading, error, reset };
};

export default useDeleteStorageFile;
