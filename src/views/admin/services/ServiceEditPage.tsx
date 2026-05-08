// @ts-nocheck
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdArrowBack, MdSave } from "react-icons/md";
import useAdditionalService from "hooks/services/useAdditionalService";
import useUpdateAdditionalService from "hooks/services/useUpdateAdditionalService";
import useServiceTypes from "hooks/services/useServiceTypes";
import { useToast } from "context/ToastContext";
import InputField from "components/form/InputField";
import SelectField from "components/form/SelectField";

const ServiceEditPage = () => {
  const { uid }     = useParams<{ uid: string }>();
  const navigate    = useNavigate();
  const { addToast } = useToast();

  const { service, loading: fetching } = useAdditionalService(uid);
  const { serviceTypes }               = useServiceTypes();
  const { updateService, loading: saving, error, fieldErrors } = useUpdateAdditionalService();

  const [formData, setFormData] = useState({
    name:         "",
    service_type: "",
    price:        "",
    currency:     "",
    is_active:    "true",
  });

  useEffect(() => {
    if (!service) return;
    setFormData({
      name:         service.name          ?? "",
      service_type: String(service.service_type ?? ""),
      price:        service.price         ?? "",
      currency:     service.currency      ?? "",
      is_active:    service.is_active ? "true" : "false",
    });
  }, [service]);

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await updateService(uid, {
      name:         formData.name,
      service_type: Number(formData.service_type),
      price:        formData.price,
      currency:     formData.currency,
      is_active:    formData.is_active === "true",
    });
    if (result) {
      addToast("Service updated successfully", "success");
      navigate(`/admin/services/${uid}`);
    }
  };

  const serviceTypeOptions = serviceTypes.map((t) => ({
    label: t.name,
    value: String(t.id),
  }));

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-slate-400">
        Loading service...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

        {/* Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100">
          <h1 className="text-base font-bold text-navy-800 leading-snug">Edit Service</h1>
          <p className="text-xs text-slate-400 mt-0.5">{service?.name}</p>
        </div>

        <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-5 space-y-4">
          {error && (
            <div className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          {/* Name */}
          <InputField
            label="Service Name"
            field="name"
            formData={formData}
            errors={fieldErrors}
            updateFormData={updateFormData}
            placeholder="e.g. Airport Transfer"
          />

          {/* Type + Currency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField
              label="Service Type"
              field="service_type"
              options={serviceTypeOptions}
              formData={formData}
              errors={fieldErrors}
              updateFormData={updateFormData}
            />
            <InputField
              label="Currency"
              field="currency"
              formData={formData}
              errors={fieldErrors}
              updateFormData={updateFormData}
              placeholder="e.g. USD"
            />
          </div>

          {/* Price + Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Price"
              field="price"
              formData={formData}
              errors={fieldErrors}
              updateFormData={updateFormData}
              placeholder="e.g. 150.00"
            />
            <SelectField
              label="Status"
              field="is_active"
              options={[
                { label: "Active",   value: "true"  },
                { label: "Inactive", value: "false" },
              ]}
              formData={formData}
              errors={fieldErrors}
              updateFormData={updateFormData}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => navigate(`/admin/services/${uid}`)}
              className="flex-1 rounded-md lg:rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition flex items-center justify-center gap-2"
            >
              <MdArrowBack size={16} />
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-md lg:rounded-lg bg-navy-800 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 disabled:opacity-60 transition flex items-center justify-center gap-2"
            >
              <MdSave size={16} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceEditPage;
