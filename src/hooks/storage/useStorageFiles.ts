import { useState, useEffect, useCallback } from "react";
import axiosInstance from "api/axiosInstance";

export interface StorageFile {
  file_key: string;
  public_url: string;
  [key: string]: unknown;
}

interface UseStorageFilesReturn {
  files: StorageFile[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const useStorageFiles = (): UseStorageFilesReturn => {
  const [files, setFiles]   = useState<StorageFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await axiosInstance.get("/storage/list");
      setFiles(Array.isArray(data) ? data : (data.files ?? []));
    } catch (err: unknown) {
      const responseData = (err as { response?: { data?: any } })?.response?.data;
      setError(
        responseData?.detail ??
        responseData?.message ??
        "Failed to load files."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  return { files, loading, error, refetch: fetchFiles };
};

export default useStorageFiles;
