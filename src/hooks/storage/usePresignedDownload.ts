import { useState } from "react";
import axiosInstance from "api/axiosInstance";

interface UsePresignedDownloadReturn {
  getDownloadUrl: (file_key: string) => Promise<string | void>;
  loading: boolean;
  error: string | null;
  reset: () => void;
}

const usePresignedDownload = (): UsePresignedDownloadReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const getDownloadUrl = async (file_key: string): Promise<string | void> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await axiosInstance.post("/storage/presigned-download-url", { file_key });
      return data.download_url as string;
    } catch (err: unknown) {
      const responseData = (err as { response?: { data?: any } })?.response?.data;
      const status = (err as { response?: { status?: number } })?.response?.status;
      setError(
        responseData?.detail ??
        responseData?.message ??
        (status === 404 ? "File not found." : "Failed to generate download URL. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setError(null);
  };

  return { getDownloadUrl, loading, error, reset };
};

export default usePresignedDownload;
