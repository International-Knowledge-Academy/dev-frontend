import { useState, useEffect, useCallback } from "react";
import axiosInstance from "api/axiosInstance";
import type { CampBrochureDownloadResponse, CampBrochureUploadResponse } from "types/camp";

const useCampBrochure = (uid: string | undefined) => {
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [fileName, setFileName]       = useState<string | null>(null);
  const [loading, setLoading]         = useState(false);
  const [uploading, setUploading]     = useState(false);
  const [progress, setProgress]       = useState(0);
  const [error, setError]             = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!uid) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.get<CampBrochureDownloadResponse>(
        `/camps/${uid}/brochure/download`
      );
      setDownloadUrl(data.download_url);
      setFileName(null);
    } catch (err: unknown) {
      const status = (err as any)?.response?.status;
      if (status !== 404) {
        const d = (err as any)?.response?.data;
        setError(d?.detail ?? d?.message ?? "Failed to load brochure.");
      }
      setDownloadUrl(null);
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => { refetch(); }, [refetch]);

  const upload = async (file: File): Promise<boolean> => {
    if (!uid) return false;
    setUploading(true);
    setProgress(0);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const { data } = await axiosInstance.put<CampBrochureUploadResponse>(
        `/camps/${uid}/brochure`,
        form,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (e) => {
            if (e.total) setProgress(Math.round((e.loaded / e.total) * 100));
          },
        }
      );
      setFileName(data.file_name ?? null);
      await refetch();
      return true;
    } catch (err: unknown) {
      const d = (err as any)?.response?.data;
      setError(d?.detail ?? d?.message ?? "Failed to upload brochure.");
      return false;
    } finally {
      setUploading(false);
    }
  };

  const update = async (file: File): Promise<boolean> => {
    if (!uid) return false;
    setUploading(true);
    setProgress(0);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const { data } = await axiosInstance.patch<CampBrochureUploadResponse>(
        `/camps/${uid}/brochure/update`,
        form,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (e) => {
            if (e.total) setProgress(Math.round((e.loaded / e.total) * 100));
          },
        }
      );
      setFileName(data.file_name ?? null);
      await refetch();
      return true;
    } catch (err: unknown) {
      const d = (err as any)?.response?.data;
      setError(d?.detail ?? d?.message ?? "Failed to update brochure.");
      return false;
    } finally {
      setUploading(false);
    }
  };

  const remove = async (): Promise<boolean> => {
    if (!uid) return false;
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.delete(`/camps/${uid}/brochure/delete`);
      setDownloadUrl(null);
      setFileName(null);
      return true;
    } catch (err: unknown) {
      const d = (err as any)?.response?.data;
      setError(d?.detail ?? d?.message ?? "Failed to remove brochure.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    downloadUrl,
    fileName,
    hasBrochure: !!downloadUrl,
    loading,
    uploading,
    progress,
    error,
    upload,
    update,
    remove,
    refetch,
  };
};

export default useCampBrochure;
