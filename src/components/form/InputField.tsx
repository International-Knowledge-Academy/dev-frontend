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
}) => {
  const value    = getNestedValue(formData, field) ?? "";
  const hasError = !!getNestedValue(errors, field);

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-navy-800 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
        {hint && <span className="ml-1 text-xs font-normal text-slate-400">({hint})</span>}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => updateFormData(field, e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-md lg:rounded-lg border bg-slate-50 px-4 py-2.5 text-sm text-navy-800 outline-none transition focus:ring-2 focus:ring-navy-300 ${
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
