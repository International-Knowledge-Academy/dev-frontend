// @ts-nocheck
import { useRef } from "react";
import { FileText, Upload, ExternalLink, X } from "lucide-react";
import usePresignedUpload from "hooks/storage/usePresignedUpload";

interface PdfUploadFieldProps {
  label: string;
  folder: string;
  displayUrl: string;
  onChange: (url: string) => void;
  error?: string;
}

const PdfUploadField = ({
  label,
  folder,
  displayUrl,
  onChange,
  error,
}: PdfUploadFieldProps) => {
  const { upload, uploading, progress, error: uploadError } = usePresignedUpload();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    const result = await upload(file, { folder, file_type: "pdf" });
    if (result) onChange(result.public_url);
  };

  const fileName = displayUrl ? displayUrl.split("/").pop() : null;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-navy-800">{label}</label>

      {/* Existing file row */}
      {displayUrl && !uploading && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-md lg:rounded-lg border border-slate-200 bg-slate-50">
          <FileText size={18} className="text-navy-500 flex-shrink-0" />
          <span className="text-sm text-navy-800 truncate flex-1" title={fileName}>{fileName}</span>
          <a
            href={displayUrl}
            target="_blank"
            rel="noreferrer"
            className="text-slate-400 hover:text-navy-600 transition flex-shrink-0"
            title="View"
          >
            <ExternalLink size={14} />
          </a>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-slate-400 hover:text-navy-600 transition flex-shrink-0"
            title="Replace"
          >
            <Upload size={14} />
          </button>
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-slate-400 hover:text-red-500 transition flex-shrink-0"
            title="Remove"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Drop zone */}
      {!displayUrl && !uploading && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full flex flex-col items-center justify-center gap-2 rounded-md lg:rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 py-6 hover:border-navy-400 hover:bg-navy-50 transition"
        >
          <FileText size={22} className="text-slate-400" />
          <span className="text-sm text-slate-500">Click to upload {label}</span>
          <span className="text-xs text-slate-400">PDF files only</span>
        </button>
      )}

      {/* Upload progress */}
      {uploading && (
        <div className="rounded-md lg:rounded-lg border border-slate-200 bg-slate-50 px-4 py-4 space-y-2">
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
      {displayUrl && !uploading && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-1.5 text-xs text-navy-600 hover:text-navy-800 transition"
        >
          <Upload size={14} />
          Replace {label}
        </button>
      )}

      {(uploadError || error) && (
        <p className="text-xs text-red-500">{uploadError || error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default PdfUploadField;
