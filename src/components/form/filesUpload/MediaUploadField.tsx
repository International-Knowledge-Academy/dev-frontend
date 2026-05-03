// @ts-nocheck
import { useRef } from "react";
import { MdUpload, MdClose, MdVideoFile, MdImage } from "react-icons/md";
import usePresignedUpload from "hooks/storage/usePresignedUpload";
import { IMAGE_TYPES, VIDEO_TYPES } from "constants/upload";

interface MediaUploadFieldProps {
  label: string;
  type: "image" | "video";
  folder: string;
  value: string;
  onChange: (url: string) => void;
  error?: string;
}

const MediaUploadField = ({
  label,
  type,
  folder,
  value,
  onChange,
  error,
}: MediaUploadFieldProps) => {
  const { upload, uploading, progress, error: uploadError, reset } = usePresignedUpload();
  const inputRef = useRef<HTMLInputElement>(null);

  const accepted = type === "video" ? VIDEO_TYPES : IMAGE_TYPES;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    const result = await upload(file, {
      folder,
      file_type: type === "image" ? "image" : "file",
    });

    if (result) {
      onChange(result.public_url);
      reset();
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-navy-800">{label}</label>

      {/* Preview */}
      {value && !uploading && (
        <div className="relative rounded-lg border border-slate-200 overflow-hidden bg-slate-50">
          {type === "image" ? (
            <img
              src={value}
              alt={label}
              className="w-full h-40 object-cover"
            />
          ) : (
            <video src={value} controls className="w-full h-40 rounded-lg" />
          )}
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-red-500 hover:border-red-300 transition shadow-sm"
          >
            <MdClose size={14} />
          </button>
        </div>
      )}

      {/* Drop zone */}
      {!value && !uploading && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 py-8 hover:border-navy-400 hover:bg-navy-50 transition"
        >
          {type === "video" ? (
            <MdVideoFile size={24} className="text-slate-400" />
          ) : (
            <MdImage size={24} className="text-slate-400" />
          )}
          <span className="text-sm text-slate-500">Click to upload {label}</span>
          <span className="text-xs text-slate-400">{accepted.label}</span>
        </button>
      )}

      {/* Upload progress */}
      {uploading && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-navy-700">Uploading...</span>
            <span className="text-sm font-semibold text-navy-600">{progress}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-navy-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Replace link */}
      {value && !uploading && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-1.5 text-xs text-navy-600 hover:text-navy-800 transition"
        >
          <MdUpload size={14} />
          Replace {label}
        </button>
      )}

      {(uploadError || error) && (
        <p className="text-xs text-red-500">{uploadError || error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accepted.extensions}
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default MediaUploadField;
