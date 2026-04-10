// @ts-nocheck
// components/form/TextareaField.jsx
import React from "react";

const getNestedValue = (obj, path) => {
  if (!path) return undefined;
  return path
    .split(/[\.\[\]]/).filter(Boolean)
    .reduce((acc, key) => (acc ? acc[key] : undefined), obj);
};

const TextareaField = ({ label, field, required = true, placeholder = "", rows = 4, formData, errors, updateFormData }) => {
  const value = getNestedValue(formData, field) ?? "";

  return (
    <div className="mb-4">
      <label className="block text-p2 font-medium text-navy-900">
        {label} {required && <span className="text-red-600">*</span>}
      </label>

      <textarea
        value={value}
        rows={rows}
        onChange={(e) => updateFormData(field, e.target.value)}
        placeholder={placeholder}
        className={`mt-2 flex w-full items-center justify-start bg-gray-50 rounded-md border px-3 py-2 text-p2 text-sm outline-none transition-colors focus:outline-none focus:ring-1 focus:ring-navy-500 resize-none ${
          getNestedValue(errors, field) ? "border-red-500" : "border-default"
        }`}
      />

      {getNestedValue(errors, field) && (
        <p className="mt-1 text-xs text-red-600">{getNestedValue(errors, field)}</p>
      )}
    </div>
  );
};

export default TextareaField;
