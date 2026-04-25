import { Upload, Trash2, FileCheck, AlertCircle, Download } from "lucide-react";
import React, { useState } from "react";
import { ALLOWED_FILE_TYPES } from "constants/upload";

/**
 * Dual-mode file upload field.
 *
 * Document-management mode (default):
 *   Requires: documentTypeId, formData, uploadHandler, removeHandler
 *
 * Simple mode (single file):
 *   Requires: simpleFile, onSimpleFileChange, onSimpleRemove
 *   Optional: existingFileUrl, existingFileName, onExistingRemove
 */
const FileUploadField = ({
  label,
  field,
  // --- document-management mode ---
  documentTypeId = null,
  formData = null,
  updateFormData = null,
  uploadHandler = null,
  removeHandler = null,
  // --- simple mode ---
  simpleFile = null,
  onSimpleFileChange = null,
  onSimpleRemove = null,
  simpleUploading = false,
  simpleProgress = 0,
  // --- simple mode: existing file ---
  existingFileUrl = null,
  existingFileName = null,
  onExistingRemove = null,
  // --- shared ---
  errors,
  required = false,
  multiple = false,
  accept = ALLOWED_FILE_TYPES.extensions.join(","),
}) => {
  const [fileError, setFileError] = useState("");

  const isSimpleMode = !documentTypeId;

  // ── document-management mode ──────────────────────────────────────────────
  const documents = !isSimpleMode ? (formData?.[field] || []) : [];
  const docFile   = !isSimpleMode
    ? documents.find((d) => d.document_type_id === documentTypeId)
    : null;

  const handleDocUpload = async (e) => {
    if (!uploadHandler) return;
    const selectedFile = e.target.files?.[0];
    if (selectedFile && !ALLOWED_FILE_TYPES.mimeTypes.includes(selectedFile.type)) {
      setFileError(`Invalid file type. Only ${ALLOWED_FILE_TYPES.label} files are allowed.`);
      e.target.value = "";
      return;
    }
    setFileError("");
    await uploadHandler(e, documentTypeId);
    e.target.value = "";
  };

  const handleDocRemove = async () => {
    if (!removeHandler) return;
    await removeHandler(documentTypeId);
  };

  // ── simple mode ───────────────────────────────────────────────────────────
  const handleSimpleUpload = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (!ALLOWED_FILE_TYPES.mimeTypes.includes(selected.type)) {
      setFileError(`Invalid file type. Only ${ALLOWED_FILE_TYPES.label} files are allowed.`);
      e.target.value = "";
      return;
    }
    setFileError("");
    onSimpleFileChange?.(selected);
    e.target.value = "";
  };

  const handleSimpleRemove = () => { setFileError(""); onSimpleRemove?.(); };
  const handleExistingRemove = () => { setFileError(""); onExistingRemove?.(); };

  const showExisting   = isSimpleMode && !simpleFile && existingFileUrl;
  const showSimpleFile = isSimpleMode && simpleFile;
  const showDocFile    = !isSimpleMode && docFile;
  const showDropzone   = isSimpleMode ? !showSimpleFile : !showDocFile;

  return (
    <div className="group mb-2">
      {label && (
        <label className="mb-3 block text-sm font-semibold text-navy-800">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}

      {/* existing file row (simple mode) */}
      {showExisting && (
        <div className="mb-3 flex items-center gap-2 rounded-md border border-navy-200 bg-navy-50 px-4 py-2.5">
          <FileCheck className="h-4 w-4 shrink-0 text-navy-600" />
          <span className="flex-1 truncate text-sm font-medium text-navy-700">
            {existingFileName || "Current file"}
          </span>
          <a
            href={existingFileUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-xs text-navy-600 hover:text-navy-800 transition"
          >
            <Download className="h-3 w-3" />
            View
          </a>
          <button
            type="button"
            onClick={handleExistingRemove}
            className="flex items-center gap-1 rounded-md lg:rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 transition hover:bg-red-100"
          >
            <Trash2 className="h-3 w-3" />
            Remove
          </button>
        </div>
      )}

      {/* dropzone */}
      {showDropzone && (
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center transition-all duration-300 hover:border-navy-400 hover:bg-navy-50">
          <Upload className="mb-3 h-8 w-8 text-slate-400 group-hover:text-navy-500" />
          <p className="text-sm text-slate-600">
            Drag & drop or{" "}
            <span className="font-semibold text-navy-600 underline">browse</span>
          </p>
          <p className="mt-1 text-xs text-slate-400">{ALLOWED_FILE_TYPES.label} accepted</p>
          <input
            type="file"
            multiple={multiple}
            accept={accept}
            className="hidden"
            onChange={isSimpleMode ? handleSimpleUpload : handleDocUpload}
          />
        </label>
      )}

      {/* newly selected file (simple mode) */}
      {showSimpleFile && (
        <div className="rounded-md border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${simpleUploading ? "bg-navy-100 text-navy-500" : "bg-green-100 text-green-600"}`}>
                <FileCheck className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-navy-800">{simpleFile.name}</p>
                <p className="text-xs text-slate-400">
                  {simpleUploading
                    ? `Uploading… ${simpleProgress}%`
                    : `${(simpleFile.size / 1024).toFixed(1)} KB`}
                </p>
              </div>
            </div>
            {!simpleUploading && (
              <button
                type="button"
                onClick={handleSimpleRemove}
                className="flex shrink-0 items-center gap-1.5 rounded-md lg:rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100"
              >
                <Trash2 className="h-3 w-3" />
                Remove
              </button>
            )}
          </div>
          {simpleUploading && (
            <div className="mt-3 h-1.5 w-full rounded-md bg-navy-100">
              <div
                className="h-full rounded-md bg-navy-500 transition-all duration-300"
                style={{ width: `${simpleProgress}%` }}
              />
            </div>
          )}
        </div>
      )}

      {/* document-management mode: file preview */}
      {showDocFile && (
        <div className={`mt-4 rounded-md border p-4 transition ${docFile.file_key ? "border-slate-200 bg-white" : "border-red-400 bg-red-50"}`}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 truncate">
              <div className={`flex h-10 w-10 items-center justify-center rounded-md ${docFile.file_key ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                <FileCheck className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className={`truncate text-sm font-semibold ${docFile.file_key ? "text-navy-800" : "text-red-700"}`}>
                  {docFile.name}
                </p>
                <p className={`text-xs ${docFile.file_key ? "text-slate-400" : "text-red-500"}`}>
                  {docFile.size}
                </p>
              </div>
            </div>
            {docFile.file_key && (
              <button
                type="button"
                onClick={handleDocRemove}
                className="flex items-center justify-center gap-2 rounded-md lg:rounded-lg border border-red-200 bg-red-50 px-4 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100"
              >
                <Trash2 className="h-3 w-3" />
                Remove
              </button>
            )}
          </div>
          {docFile.uploading && (
            <div className={`mt-4 h-1.5 w-full rounded-md ${docFile.file_key ? "bg-green-200" : "bg-red-200"}`}>
              <div
                className={`h-full rounded-md ${docFile.file_key ? "bg-green-600" : "bg-red-600"} transition-all duration-300`}
                style={{ width: `${docFile.progress || 0}%` }}
              />
            </div>
          )}
        </div>
      )}

      {fileError && (
        <div className="mt-2 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-2">
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

export default FileUploadField;
