import { Upload, Trash2, FileCheck, AlertCircle, Camera } from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
import { ALLOWED_FILE_TYPES, IMAGE_TYPES } from "constants/upload";

/**
 * Dual-mode file upload field.
 *
 * Document-management mode (default):
 *   Requires: documentTypeId, formData, uploadHandler, removeHandler
 *
 * Simple mode (single file / logo):
 *   Requires: simpleFile, onSimpleFileChange, onSimpleRemove
 *   Optional: existingUrl, onExistingRemove  ← for the edit/update flow
 *   Optional: imageOnly  ← restricts to PNG/JPG only (no PDF)
 */
const ImageUploadField = ({
  label,
  field,
  // --- document-management mode ---
  documentTypeId = null,
  formData = null,
  uploadHandler = null,
  removeHandler = null,
  // --- simple mode ---
  simpleFile = null,
  onSimpleFileChange = null,
  onSimpleRemove = null,
  simpleUploading = false,
  simpleProgress = 0,
  // --- simple mode: existing image (update flow) ---
  existingUrl = null,
  onExistingRemove = null,
  // --- shared ---
  errors,
  required = false,
  multiple = false,
  imageOnly = false,
  accept = null,
}) => {
  const resolvedAccept     = accept ?? (imageOnly ? IMAGE_TYPES.extensions : ALLOWED_FILE_TYPES.extensions.join(","));
  const resolvedMimeTypes  = imageOnly ? IMAGE_TYPES.mimeTypes : ALLOWED_FILE_TYPES.mimeTypes;
  const resolvedLabel      = imageOnly ? IMAGE_TYPES.label : ALLOWED_FILE_TYPES.label;

  const [fileError, setFileError] = useState("");
  const [imgError, setImgError]   = useState(false);

  const previewUrl = useMemo(() => {
    if (!simpleFile) return null;
    return URL.createObjectURL(simpleFile);
  }, [simpleFile]);

  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  useEffect(() => { setImgError(false); }, [existingUrl]);

  const isSimpleMode = !documentTypeId;

  const documents = !isSimpleMode ? (formData?.[field] || []) : [];
  const docFile   = !isSimpleMode ? documents.find((d) => d.document_type_id === documentTypeId) : null;

  const handleDocUpload = async (e) => {
    if (!uploadHandler) return;
    const selected = e.target.files?.[0];
    if (selected && !resolvedMimeTypes.includes(selected.type)) {
      setFileError(`Invalid file type. Only ${resolvedLabel} files are allowed.`);
      e.target.value = "";
      return;
    }
    setFileError("");
    await uploadHandler(e, documentTypeId);
  };

  const handleDocRemove = async () => {
    if (!removeHandler) return;
    await removeHandler(documentTypeId);
  };

  const handleSimpleUpload = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (!resolvedMimeTypes.includes(selected.type)) {
      setFileError(`Invalid file type. Only ${resolvedLabel} files are allowed.`);
      e.target.value = "";
      return;
    }
    setFileError("");
    onSimpleFileChange?.(selected);
    e.target.value = "";
  };

  const handleSimpleRemove  = () => { setFileError(""); onSimpleRemove?.(); };
  const handleExistingRemove = () => { setFileError(""); onExistingRemove?.(); };

  const showDocFile    = !isSimpleMode && docFile;
  const showSimpleFile = isSimpleMode && simpleFile;
  const showExisting   = isSimpleMode && !simpleFile && existingUrl;
  const showDropzone   = !(showDocFile || showSimpleFile || showExisting);

  return (
    <div className="mb-2">
      {label && (
        <label className="mb-3 block text-sm font-semibold text-navy-800">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}

      {/* simple mode dropzone */}
      {showDropzone && isSimpleMode && (
        <div className="flex flex-col items-center gap-2">
          <label className="group relative cursor-pointer">
            <div className="flex h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 transition-all duration-200 group-hover:border-navy-400 group-hover:bg-navy-50">
              <div className="flex flex-col items-center gap-1">
                <Camera className="h-6 w-6 text-slate-400 transition-colors group-hover:text-navy-500" />
                <span className="text-[10px] font-medium text-slate-400 transition-colors group-hover:text-navy-500">Upload</span>
              </div>
            </div>
            <input type="file" multiple={multiple} accept={resolvedAccept} className="hidden" onChange={handleSimpleUpload} />
          </label>
          <p className="text-xs text-slate-500">Click to upload</p>
          <p className="text-[10px] text-slate-400">{resolvedLabel} accepted</p>
        </div>
      )}

      {/* document-management mode dropzone */}
      {showDropzone && !isSimpleMode && (
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center transition-all duration-300 hover:border-navy-400 hover:bg-navy-50">
          <Upload className="mb-3 h-8 w-8 text-slate-400" />
          <p className="text-sm text-slate-600">
            Drag & drop or{" "}
            <span className="font-semibold text-navy-600 underline">browse</span>
          </p>
          <p className="mt-1 text-xs text-slate-400">{resolvedLabel} accepted</p>
          <input type="file" multiple={multiple} accept={resolvedAccept} className="hidden" onChange={handleDocUpload} />
        </label>
      )}

      {/* existing URL preview (update flow) */}
      {showExisting && (
        <div className="flex flex-col items-center gap-2">
          <div className="group relative">
            {imgError ? (
              <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-navy-400 bg-navy-700 shadow-sm">
                <Camera className="h-5 w-5 text-white" />
                <span className="mt-0.5 text-[10px] font-medium text-white">Upload</span>
                <input type="file" accept={resolvedAccept} className="hidden" onChange={handleSimpleUpload} />
              </label>
            ) : (
              <>
                <img
                  src={existingUrl}
                  alt="Current"
                  className="h-24 w-24 rounded-lg object-cover ring-2 ring-navy-500 ring-offset-2 shadow-md"
                  onError={() => setImgError(true)}
                />
                <label className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center rounded-lg bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <Camera className="h-5 w-5 text-white" />
                  <span className="mt-0.5 text-[10px] font-medium text-white">Replace</span>
                  <input type="file" accept={resolvedAccept} className="hidden" onChange={handleSimpleUpload} />
                </label>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={handleExistingRemove}
            className="flex items-center gap-1 rounded-lg lg:rounded-lg border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-600 transition hover:bg-red-100"
          >
            <Trash2 className="h-3 w-3" />
            Remove
          </button>
        </div>
      )}

      {/* newly selected file preview (simple mode) */}
      {showSimpleFile && (
        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            <div className={`flex h-24 w-24 overflow-hidden rounded-lg shadow-md ring-2 ring-offset-2 ${simpleUploading ? "ring-navy-400" : "ring-green-400"}`}>
              {simpleFile.type?.startsWith("image/") ? (
                <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <div className={`flex h-full w-full items-center justify-center ${simpleUploading ? "bg-navy-50" : "bg-green-50"}`}>
                  <FileCheck className={`h-6 w-6 ${simpleUploading ? "text-navy-500" : "text-green-500"}`} />
                </div>
              )}
            </div>
            {simpleUploading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/30">
                <span className="text-xs font-bold text-white">{simpleProgress}%</span>
              </div>
            )}
          </div>
          <p className="max-w-[140px] truncate text-center text-xs font-medium text-navy-800">{simpleFile.name}</p>
          <p className="text-[10px] text-slate-400">
            {simpleUploading ? `Uploading… ${simpleProgress}%` : `${(simpleFile.size / 1024).toFixed(1)} KB`}
          </p>
          {simpleUploading && (
            <div className="h-1 w-24 rounded-lg bg-navy-100">
              <div className="h-full rounded-lg bg-navy-500 transition-all duration-300" style={{ width: `${simpleProgress}%` }} />
            </div>
          )}
          <button
            type="button"
            onClick={handleSimpleRemove}
            disabled={simpleUploading}
            className="flex items-center gap-1 rounded-lg lg:rounded-lg border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-50"
          >
            <Trash2 className="h-3 w-3" />
            Remove
          </button>
        </div>
      )}

      {/* document-management mode: file preview */}
      {showDocFile && (
        <div className={`mt-4 rounded-lg border p-4 transition ${docFile.file_key ? "border-slate-200 bg-white" : "border-red-400 bg-red-50"}`}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 truncate">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${docFile.file_key ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                <FileCheck className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className={`truncate text-sm font-semibold ${docFile.file_key ? "text-navy-800" : "text-red-700"}`}>{docFile.name}</p>
                <p className={`text-xs ${docFile.file_key ? "text-slate-400" : "text-red-500"}`}>{docFile.size}</p>
              </div>
            </div>
            {docFile.file_key && (
              <button
                type="button"
                onClick={handleDocRemove}
                className="flex shrink-0 items-center gap-2 rounded-lg lg:rounded-lg border border-red-200 bg-red-50 px-4 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100"
              >
                <Trash2 className="h-3 w-3" />
                Remove
              </button>
            )}
          </div>
          {docFile.uploading && (
            <div className={`mt-4 h-1.5 w-full rounded-lg ${docFile.file_key ? "bg-green-200" : "bg-red-200"}`}>
              <div
                className={`h-full rounded-lg ${docFile.file_key ? "bg-green-600" : "bg-red-600"} transition-all duration-300`}
                style={{ width: `${docFile.progress || 0}%` }}
              />
            </div>
          )}
        </div>
      )}

      {fileError && (
        <div className="mt-2 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-2">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
          <p className="text-xs font-medium text-red-700">{fileError}</p>
        </div>
      )}

      {errors?.[field] && (
        <p className="mt-2 text-xs font-medium text-red-600">{errors[field]}</p>
      )}
    </div>
  );
};

export default ImageUploadField;
