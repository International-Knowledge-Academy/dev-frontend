// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "context/ToastContext";
import useCreateRegistration from "hooks/registrations/useCreateRegistration";
import useAllPrograms from "hooks/programs/useAllPrograms";
import PageHeader from "components/ui/PageHeader";
import InputField from "components/form/InputField";
import Button from "components/ui/buttons/Button";
import SearchableDropdown from "components/form/search/SearchableDropdown";

const TYPE_OPTIONS = [
  { value: "personal",  label: "Personal"  },
  { value: "corporate", label: "Corporate" },
];

const RegistrationCreatePage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { createRegistration, loading, error, fieldErrors } = useCreateRegistration();
  const { programs, loading: loadingPrograms } = useAllPrograms();

  const [form, setForm] = useState({
    program_uid:       "",
    full_name:         "",
    email:             "",
    phone:             "",
    job_title:         "",
    address:           "",
    registration_type: "personal",
    admin_notes:       "",
  });

  const update = (key: string, value: any) =>
    setForm((p) => ({ ...p, [key]: value }));

  const programOptions = programs.map((p) => ({
    value: p.uid,
    label: p.name,
  }));

  const isValid =
    form.program_uid.trim() !== "" &&
    form.full_name.trim()   !== "" &&
    form.email.trim()       !== "" &&
    form.phone.trim()       !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const created = await createRegistration(form);
    if (created) {
      addToast("Registration created successfully", "success");
      navigate("/admin/registrations");
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <PageHeader
          title="New Registration"
          subtitle="Register a participant for a program"
          bordered
        />

        <form onSubmit={handleSubmit} className="px-6 py-5 grid grid-cols-1 gap-4">
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Program */}
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">
            Program
          </p>
          <SearchableDropdown
            label="Program"
            field="program_uid"
            options={programOptions}
            formData={form}
            errors={fieldErrors}
            updateFormData={update}
            placeholder={loadingPrograms ? "Loading programs..." : "Search and select a program..."}
          />

          {/* Participant Info */}
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2 mt-2">
            Participant Details
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Full Name"
              field="full_name"
              placeholder="John Doe"
              formData={form}
              errors={fieldErrors}
              updateFormData={update}
            />
            <InputField
              label="Email"
              field="email"
              type="email"
              placeholder="john@example.com"
              formData={form}
              errors={fieldErrors}
              updateFormData={update}
            />
            <InputField
              label="Phone"
              field="phone"
              placeholder="+971 50 000 0000"
              formData={form}
              errors={fieldErrors}
              updateFormData={update}
            />
            <InputField
              label="Job Title"
              field="job_title"
              placeholder="Software Engineer"
              required={false}
              formData={form}
              errors={fieldErrors}
              updateFormData={update}
            />
            <SearchableDropdown
              label="Registration Type"
              field="registration_type"
              options={TYPE_OPTIONS}
              formData={form}
              errors={fieldErrors}
              updateFormData={update}
              placeholder="Select type..."
            />
            <InputField
              label="Address"
              field="address"
              placeholder="123 Main St, Dubai"
              required={false}
              formData={form}
              errors={fieldErrors}
              updateFormData={update}
            />
          </div>

          {/* Notes */}
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2 mt-2">
            Admin Notes
          </p>
          <InputField
            label="Admin Notes"
            field="admin_notes"
            placeholder="Internal notes about this registration..."
            required={false}
            formData={form}
            errors={fieldErrors}
            updateFormData={update}
          />

          <div className="flex gap-2 border-t border-slate-100 pt-5">
            <Button
              type="button"
              text="Cancel"
              onClick={() => navigate("/admin/registrations")}
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
              text={loading ? "Creating..." : "Create Registration"}
              disabled={loading || !isValid}
              className="flex-1"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationCreatePage;
