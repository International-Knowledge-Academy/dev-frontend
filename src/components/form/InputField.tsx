// @ts-nocheck
import React from "react";

const getNestedValue = (obj, path) => {
  if (!path) return undefined;
  return path.split(/[.[\]]/).filter(Boolean).reduce((acc, key) => (acc ? acc[key] : undefined), obj);
};

const InputField = ({
  label,
  field,
  type = "text",
  required = true,
  placeholder = "",
  hint,
  formData,
  errors,
  updateFormData,
  wrapperClassName = "mb-4",
}) => {
  const value    = getNestedValue(formData, field) ?? "";
  const hasError = !!getNestedValue(errors, field);

  return (
    <div className={wrapperClassName}>
      {label && (
        <label className="block text-sm font-medium text-slate-900 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
          {hint && <span className="ml-1 text-xs font-normal text-slate-400">({hint})</span>}
        </label>
      )}

      <input
        type={type}
        value={value}
        onChange={(e) => updateFormData(field, e.target.value)}
        placeholder={placeholder}
        className={`${label ? "mt-2" : ""} flex h-12 w-full items-center bg-slate-50 hover:bg-slate-100/70 rounded-md border px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 ${
          hasError ? "border-red-400 focus:ring-red-200" : "border-slate-200"
        }`}
      />

      {hasError && (
        <p className="mt-1 text-xs text-red-500">{getNestedValue(errors, field)}</p>
      )}
    </div>
  );
};

export default InputField;
