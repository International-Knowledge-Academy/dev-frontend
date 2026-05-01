// @ts-nocheck
interface CompactToggleProps {
  label: string;
  description?: string;
  field: string;
  formData: Record<string, any>;
  updateFormData: (key: string, value: any) => void;
  errors?: Record<string, string>;
}

const CompactToggle = ({
  label,
  description,
  field,
  formData,
  updateFormData,
  errors,
}: CompactToggleProps) => {
  const value = Boolean(formData[field]);

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-navy-800">{label}</p>
          {description && (
            <p className="text-xs text-slate-400 mt-0.5">{description}</p>
          )}
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={value}
          onClick={() => updateFormData(field, !value)}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-400 focus-visible:ring-offset-2 ${
            value ? "bg-navy-600" : "bg-slate-200"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 flex-shrink-0 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${
              value ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
      {errors?.[field] && (
        <p className="mt-1.5 text-xs text-red-500">{errors[field]}</p>
      )}
    </div>
  );
};

export default CompactToggle;
