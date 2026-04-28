import { useState } from "react";
import axiosInstance from "api/axiosInstance";

interface PresignedUploadOptions {
  folder: string;
  file_type?: "file" | "image";
  max_file_size?: number;
}

export interface PresignedUploadResult {
  file_key: string;
  public_url: string;
}

interface UsePresignedUploadReturn {
  upload: (file: File, options: PresignedUploadOptions) => Promise<PresignedUploadResult | void>;
  uploading: boolean;
  progress: number;
  error: string | null;
  reset: () => void;
}

const usePresignedUpload = (): UsePresignedUploadReturn => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress]   = useState(0);
  const [error, setError]         = useState<string | null>(null);

  const upload = async (
    file: File,
    options: PresignedUploadOptions
  ): Promise<PresignedUploadResult | void> => {
    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      // Step 1: get presigned URL from backend
      const { data } = await axiosInstance.post("/storage/presigned-upload-urls", {
        files: [
          {
            file_name:     file.name,
            content_type:  file.type,
            file_type:     options.file_type ?? "file",
            folder:        options.folder,
            max_file_size: options.max_file_size ?? file.size,
          },
        ],
      });

      const uploadInfo = data.uploads?.[0];
      if (!uploadInfo) throw new Error("No upload URL returned from server.");

      const { upload_url, fields, file_key, public_url } = uploadInfo;

      // Step 2: upload directly to DigitalOcean Spaces via XHR (enables progress tracking)
      await new Promise<void>((resolve, reject) => {
        const formData = new FormData();
        Object.entries(fields as Record<string, string>).forEach(([key, value]) => {
          formData.append(key, value);
        });
        formData.append("file", file);

        const xhr = new XMLHttpRequest();
        xhr.open("POST", upload_url);

        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            setProgress(100);
            resolve();
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        });

        xhr.addEventListener("error", () => reject(new Error("Upload failed. Please try again.")));
        xhr.addEventListener("abort", () => reject(new Error("Upload was cancelled.")));

        xhr.send(formData);
      });

      return { file_key, public_url };
    } catch (err: unknown) {
      const responseData = (err as { response?: { data?: any } })?.response?.data;
      setError(
        responseData?.detail ??
        responseData?.message ??
        (err as Error)?.message ??
        "Upload failed. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  const reset = () => {
    setUploading(false);
    setProgress(0);
    setError(null);
  };

  return { upload, uploading, progress, error, reset };
};

export default usePresignedUpload;
