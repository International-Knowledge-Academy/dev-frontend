import { useState, useEffect, useCallback } from "react";
import axiosInstance from "api/axiosInstance";

export type StorageFolder =
  | "images"
  | "images/profiles"
  | "thumbnails"
  | "documents"
  | "documents/cvs"
  | "videos"
  | "uploads";

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

const useStorageFiles = (folder?: StorageFolder): UseStorageFilesReturn => {
  const [files, setFiles]     = useState<StorageFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await axiosInstance.get("/storage/list", {
        params: folder ? { folder } : undefined,
      });
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
  }, [folder]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  return { files, loading, error, refetch: fetchFiles };
};

export default useStorageFiles;
