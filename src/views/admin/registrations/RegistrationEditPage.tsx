// @ts-nocheck
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "context/ToastContext";
import useGetRegistration from "hooks/registrations/useGetRegistration";
import useUpdateRegistration from "hooks/registrations/useUpdateRegistration";
import PageHeader from "components/ui/PageHeader";
import InputField from "components/form/InputField";
import Button from "components/ui/buttons/Button";
import SearchableDropdown from "components/form/search/SearchableDropdown";
import ToggleInput from "components/form/toggle/ToggleInput";

const TYPE_OPTIONS = [
  { value: "personal",  label: "Personal"  },
  { value: "corporate", label: "Corporate" },
];

const STATUS_OPTIONS = [
  { value: "pending",   label: "Pending"   },
  { value: "approved",  label: "Approved"  },
  { value: "rejected",  label: "Rejected"  },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const RegistrationEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const { registration, loading: loadingReg, error: loadError } = useGetRegistration(id);
  const { updateRegistration, loading: updating, error, fieldErrors } = useUpdateRegistration();

  const [form, setForm] = useState({
    full_name:            "",
    email:                "",
    phone:                "",
    job_title:            "",
    address:              "",
    registration_type:    "personal",
    program:              "",
    program_price:        "",
    admin_notes:          "",
    status:               "pending",
    certificate_issued:   false,
    certificate_issue_date: "",
  });

  useEffect(() => {
    if (registration) {
      setForm({
        full_name:            registration.full_name ?? "",
        email:                registration.email ?? "",
        phone:                registration.phone ?? "",
        job_title:            registration.job_title ?? "",
        address:              registration.address ?? "",
        registration_type:    registration.registration_type ?? "personal",
        program:              String(registration.program ?? ""),
        program_price:        registration.program_price ?? "",
        admin_notes:          registration.admin_notes ?? "",
        status:               registration.status ?? "pending",
        certificate_issued:   registration.certificate_issued ?? false,
        certificate_issue_date: registration.certificate_issue_date ?? "",
      });
    }
  }, [registration]);

  const update = (key: string, value: any) =>
    setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      program: form.program ? Number(form.program) : undefined,
      program_price: form.program_price || undefined,
      certificate_issue_date: form.certificate_issue_date || null,
    };
    const updated = await updateRegistration(id, payload);
    if (updated) {
      addToast("Registration updated", "success");
      navigate(`/admin/registrations/${id}`);
    }
  };

  if (loadingReg) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-slate-400">
        Loading registration...
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-red-500">
        {loadError}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <PageHeader
          title="Edit Registration"
          subtitle={<>Editing registration for <span className="font-semibold text-navy-700">{registration?.full_name}</span></>}
          bordered
        />

        <form onSubmit={handleSubmit} className="px-6 py-5 grid grid-cols-1 gap-4">
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-600">
              {error}
            </div>
          )}

          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">
            Participant Details
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Full Name" field="full_name" placeholder="John Doe"             formData={form} errors={fieldErrors} updateFormData={update} />
            <InputField label="Email"     field="email"     type="email" placeholder="john@example.com" formData={form} errors={fieldErrors} updateFormData={update} />
            <InputField label="Phone"     field="phone"     placeholder="+971 50 000 0000"     formData={form} errors={fieldErrors} updateFormData={update} />
            <InputField label="Job Title" field="job_title" placeholder="Software Engineer" required={false} formData={form} errors={fieldErrors} updateFormData={update} />
            <SearchableDropdown label="Registration Type" field="registration_type" options={TYPE_OPTIONS} formData={form} errors={fieldErrors} updateFormData={update} placeholder="Select type..." />
            <InputField label="Address"   field="address"   placeholder="123 Main St" required={false} formData={form} errors={fieldErrors} updateFormData={update} />
          </div>

          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2 mt-2">
            Program & Pricing
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Program ID"    field="program"       type="number" placeholder="e.g. 42"       formData={form} errors={fieldErrors} updateFormData={update} />
            <InputField label="Program Price" field="program_price" placeholder="e.g. 2500.00" required={false} formData={form} errors={fieldErrors} updateFormData={update} />
          </div>

          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2 mt-2">
            Status & Certificate
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SearchableDropdown label="Status" field="status" options={STATUS_OPTIONS} formData={form} errors={fieldErrors} updateFormData={update} placeholder="Select status..." />
            <InputField label="Certificate Issue Date" field="certificate_issue_date" type="date" required={false} formData={form} errors={fieldErrors} updateFormData={update} />
          </div>
          <ToggleInput label="Certificate Issued" field="certificate_issued" formData={form} errors={fieldErrors} updateFormData={update} />

          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2 mt-2">
            Admin Notes
          </p>
          <InputField label="Admin Notes" field="admin_notes" placeholder="Internal notes..." required={false} formData={form} errors={fieldErrors} updateFormData={update} />

          <div className="flex gap-2 border-t border-slate-100 pt-4">
            <Button
              type="button"
              text="Cancel"
              onClick={() => navigate(`/admin/registrations/${id}`)}
              className="flex-1"
              bgColor="bg-white"
              textColor="text-slate-600"
              borderColor="border-slate-200"
              hoverBgColor="hover:bg-slate-50"
              hoverTextColor=""
              hoverBorderColor=""
            />
            <Button
              type="submit"
              variant="primary"
              text={updating ? "Saving..." : "Save Changes"}
              disabled={updating}
              className="flex-1"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationEditPage;
