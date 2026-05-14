// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowBack, MdSave } from "react-icons/md";
import useCreateService from "hooks/services/useCreateService";
import useRegistrations from "hooks/registrations/useRegistrations";
import { useToast } from "context/ToastContext";
import InputField from "components/form/InputField";
import TextareaField from "components/form/TextareaField";
import SearchableDropdown from "components/form/search/SearchableDropdown";

const ServiceCreatePage = () => {
  const navigate     = useNavigate();
  const { addToast } = useToast();
  const { createService, loading, error, fieldErrors } = useCreateService();
  const { registrations } = useRegistrations();

  const [formData, setFormData] = useState({
    name:             "",
    summary:          "",
    is_active:        true,
    registration_uid: "",
  });

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const registrationOptions = [
    { value: "", label: "Select a registration..." },
    ...registrations.map((r) => ({
      value: r.uid,
      label: r.full_name
        ? `${r.full_name}${r.program?.name ? ` — ${r.program.name}` : ""}`
        : r.email,
    })),
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createService({
      name:             formData.name,
      summary:          formData.summary || undefined,
      is_active:        formData.is_active,
      registration_uid: formData.registration_uid,
    });
    if (result) {
      addToast("Service created successfully", "success");
      navigate("/account-manager/services");
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

        {/* Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100">
          <h1 className="text-base font-bold text-navy-800 leading-snug">New Service</h1>
          <p className="text-xs text-slate-400 mt-0.5">Add a new service to the academy</p>
        </div>

        <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-5 space-y-4">
          {error && (
            <div className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <InputField
            label="Service Name"
            field="name"
            formData={formData}
            errors={fieldErrors}
            updateFormData={updateFormData}
            placeholder="e.g. Airport Transfer"
            required
          />

          <TextareaField
            label="Summary"
            field="summary"
            formData={formData}
            errors={fieldErrors}
            updateFormData={updateFormData}
            placeholder="Brief description of the service..."
          />

          <SearchableDropdown
            label="Registration"
            field="registration_uid"
            options={registrationOptions}
            formData={formData}
            errors={fieldErrors}
            updateFormData={updateFormData}
            placeholder="Select a registration..."
            required
          />

          {/* Active toggle */}
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-navy-800">Active</p>
              <p className="text-xs text-slate-400 mt-0.5">Service will be visible and available</p>
            </div>
            <button
              type="button"
              onClick={() => updateFormData("is_active", !formData.is_active)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none ${
                formData.is_active ? "bg-navy-700" : "bg-slate-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                  formData.is_active ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate("/account-manager/services")}
              className="flex-1 rounded-md lg:rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition flex items-center justify-center gap-2"
            >
              <MdArrowBack size={16} />
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.name.trim() || !formData.registration_uid}
              className="flex-1 rounded-md lg:rounded-lg bg-navy-800 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 disabled:opacity-60 transition flex items-center justify-center gap-2"
            >
              <MdSave size={16} />
              {loading ? "Creating..." : "Create Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceCreatePage;
