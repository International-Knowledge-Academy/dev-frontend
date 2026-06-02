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
  const resolvedAccept    = accept ?? (imageOnly ? IMAGE_TYPES.extensions : ALLOWED_FILE_TYPES.extensions.join(","));
  const resolvedMimeTypes = imageOnly ? IMAGE_TYPES.mimeTypes : ALLOWED_FILE_TYPES.mimeTypes;
  const resolvedLabel     = imageOnly ? IMAGE_TYPES.label : ALLOWED_FILE_TYPES.label;

  const [fileError, setFileError] = useState("");
  const [imgError,  setImgError]  = useState(false);

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

  const handleSimpleRemove   = () => { setFileError(""); onSimpleRemove?.(); };
  const handleExistingRemove = () => { setFileError(""); onExistingRemove?.(); };

  const showDocFile    = !isSimpleMode && docFile;
  const showSimpleFile = isSimpleMode && simpleFile;
  const showExisting   = isSimpleMode && !simpleFile && existingUrl;
  const showDropzone   = !(showDocFile || showSimpleFile || showExisting);

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-navy-800 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* ── simple mode: dropzone ── */}
      {showDropzone && isSimpleMode && (
        <label className="group flex cursor-pointer flex-col items-center justify-center gap-2.5 rounded-md lg:rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 py-6 px-4 text-center transition-all duration-200 hover:border-navy-400 hover:bg-navy-50">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition group-hover:border-navy-300 group-hover:bg-navy-50">
            <Camera className="h-5 w-5 text-slate-400 transition group-hover:text-navy-500" />
          </div>
          <div>
            <p className="text-sm text-slate-600">
              Click to <span className="font-semibold text-navy-600">upload photo</span>
            </p>
            <p className="mt-0.5 text-xs text-slate-400">{resolvedLabel}</p>
          </div>
          <input type="file" multiple={multiple} accept={resolvedAccept} className="hidden" onChange={handleSimpleUpload} />
        </label>
      )}

      {/* ── document-management mode: dropzone ── */}
      {showDropzone && !isSimpleMode && (
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-md lg:rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center transition-all duration-300 hover:border-navy-400 hover:bg-navy-50">
          <Upload className="mb-3 h-8 w-8 text-slate-400" />
          <p className="text-sm text-slate-600">
            Drag & drop or{" "}
            <span className="font-semibold text-navy-600 underline">browse</span>
          </p>
          <p className="mt-1 text-xs text-slate-400">{resolvedLabel} accepted</p>
          <input type="file" multiple={multiple} accept={resolvedAccept} className="hidden" onChange={handleDocUpload} />
        </label>
      )}

      {/* ── simple mode: existing URL (update flow) ── */}
      {showExisting && (
        <div className="rounded-md lg:rounded-lg border border-slate-200 bg-white p-3">
          <div className="flex items-center gap-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md">
              {imgError ? (
                <label className="flex h-full w-full cursor-pointer items-center justify-center bg-slate-100">
                  <Camera className="h-5 w-5 text-slate-400" />
                  <input type="file" accept={resolvedAccept} className="hidden" onChange={handleSimpleUpload} />
                </label>
              ) : (
                <img
                  src={existingUrl}
                  alt="Current"
                  className="h-full w-full object-cover"
                  onError={() => setImgError(true)}
                />
              )}
              <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-md bg-black/40 opacity-0 transition-opacity duration-200 hover:opacity-100">
                <Camera className="h-4 w-4 text-white" />
                <input type="file" accept={resolvedAccept} className="hidden" onChange={handleSimpleUpload} />
              </label>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-navy-800">Current photo</p>
              <p className="text-xs text-slate-400">Hover to replace</p>
            </div>
            <button
              type="button"
              onClick={handleExistingRemove}
              className="flex shrink-0 items-center gap-1 rounded-md lg:rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove
            </button>
          </div>
        </div>
      )}

      {/* ── simple mode: newly selected file preview ── */}
      {showSimpleFile && (
        <div className="rounded-md lg:rounded-lg border border-slate-200 bg-white p-3">
          <div className="flex items-center gap-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md">
              {simpleFile.type?.startsWith("image/") ? (
                <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-slate-100">
                  <FileCheck className="h-6 w-6 text-slate-400" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-navy-800">{simpleFile.name}</p>
              <p className="text-xs text-slate-400">
                {simpleUploading ? `Uploading… ${simpleProgress}%` : `${(simpleFile.size / 1024).toFixed(1)} KB`}
              </p>
            </div>
            <button
              type="button"
              onClick={handleSimpleRemove}
              disabled={simpleUploading}
              className="flex shrink-0 items-center gap-1 rounded-md lg:rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove
            </button>
          </div>
          {simpleUploading && (
            <div className="mt-3 h-1 w-full rounded-full bg-navy-100">
              <div
                className="h-full rounded-full bg-navy-500 transition-all duration-300"
                style={{ width: `${simpleProgress}%` }}
              />
            </div>
          )}
        </div>
      )}

      {/* ── document-management mode: file preview ── */}
      {showDocFile && (
        <div className={`mt-4 rounded-md lg:rounded-lg border p-4 transition ${docFile.file_key ? "border-slate-200 bg-white" : "border-red-400 bg-red-50"}`}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 truncate">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${docFile.file_key ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
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
                className="flex shrink-0 items-center gap-2 rounded-md lg:rounded-lg border border-red-200 bg-red-50 px-4 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100"
              >
                <Trash2 className="h-3 w-3" />
                Remove
              </button>
            )}
          </div>
          {docFile.uploading && (
            <div className={`mt-4 h-1.5 w-full rounded-full ${docFile.file_key ? "bg-green-200" : "bg-red-200"}`}>
              <div
                className={`h-full rounded-full ${docFile.file_key ? "bg-green-600" : "bg-red-600"} transition-all duration-300`}
                style={{ width: `${docFile.progress || 0}%` }}
              />
            </div>
          )}
        </div>
      )}

      {fileError && (
        <div className="mt-2 flex items-start gap-2 rounded-md lg:rounded-lg border border-red-200 bg-red-50 p-2">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
          <p className="text-xs font-medium text-red-700">{fileError}</p>
        </div>
      )}

      {errors?.[field] && (
        <p className="mt-1 text-xs text-red-500">{errors[field]}</p>
      )}
    </div>
  );
};

export default ImageUploadField;
