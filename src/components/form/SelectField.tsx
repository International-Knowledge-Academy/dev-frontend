// @ts-nocheck
// components/form/SelectField.jsx
import React from "react";

const getNestedValue = (obj, path) => {
  if (!path) return undefined;
  return path
    .split(/[.[\]]/).filter(Boolean)
    .reduce((acc, key) => (acc ? acc[key] : undefined), obj);
};

const SelectField = ({ label, field, options, required = true, formData, errors, updateFormData }) => {
  const value = getNestedValue(formData, field) ?? "";

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-navy-800 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <select
        value={value}
        onChange={(e) => updateFormData(field, e.target.value)}
        className={`w-full rounded-md lg:rounded-lg border bg-slate-50 px-4 py-2.5 text-sm text-navy-800 outline-none transition focus:ring-2 focus:ring-navy-300 ${
          getNestedValue(errors, field) ? "border-red-400 focus:ring-red-200" : "border-slate-200"
        }`}
      >
        <option value="">Select ...</option>
        {options.map((opt, index) =>
          typeof opt === "object" && opt !== null ? (
            <option key={opt.value ?? index} value={opt.value ?? ""}>
              {opt.label ?? opt.value ?? ""}
            </option>
          ) : (
            <option key={opt + index} value={opt}>
              {opt}
            </option>
          )
        )}
      </select>

      {getNestedValue(errors, field) && (
        <p className="mt-1 text-xs text-red-500">{getNestedValue(errors, field)}</p>
      )}
    </div>
  );
};

export default SelectField;
