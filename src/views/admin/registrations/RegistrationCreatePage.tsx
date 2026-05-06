// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link2, PenLine } from "lucide-react";
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

  const [mode, setMode] = useState<"program" | "manual">("program");

  const [form, setForm] = useState({
    full_name:         "",
    email:             "",
    phone:             "",
    job_title:         "",
    address:           "",
    registration_type: "personal",
    program:           "",
    program_price:     "",
    admin_notes:       "",
  });

  const update = (key: string, value: any) =>
    setForm((p) => ({ ...p, [key]: value }));

  const programOptions = programs.map((p) => ({
    value: String(p.id ?? p.uid),
    label: p.name,
    _price: p.price ?? "",
    _id: p.id,
  }));

  const handleProgramSelect = (val: string) => {
    const found = programs.find((p) => String(p.id ?? p.uid) === val);
    update("program", val);
    if (found?.price) update("program_price", found.price);
  };

  const isValid =
    form.full_name.trim() !== "" &&
    form.email.trim() !== "" &&
    form.phone.trim() !== "" &&
    (mode === "manual" ? form.program.trim() !== "" : form.program !== "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      program: Number(form.program),
      program_price: form.program_price || undefined,
    };
    const created = await createRegistration(payload);
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

        {/* Mode toggle */}
        <div className="px-6 pt-5">
          <div className="inline-flex rounded-lg border border-slate-200 p-1 bg-slate-50 gap-1">
            <button
              type="button"
              onClick={() => setMode("program")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
                mode === "program"
                  ? "bg-navy-800 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Link2 size={14} />
              Link to Program
            </button>
            <button
              type="button"
              onClick={() => setMode("manual")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
                mode === "manual"
                  ? "bg-navy-800 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <PenLine size={14} />
              Manual Entry
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-1.5">
            {mode === "program"
              ? "Search and select a program — price will be auto-filled."
              : "Enter all details manually, including program ID and price."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 grid grid-cols-1 gap-4">
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Participant Info */}
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">
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

          {/* Program */}
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2 mt-2">
            Program & Pricing
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mode === "program" ? (
              <div className="md:col-span-2">
                <SearchableDropdown
                  label="Program"
                  field="program"
                  options={programOptions}
                  formData={form}
                  errors={fieldErrors}
                  updateFormData={(_, val) => handleProgramSelect(val)}
                  placeholder={loadingPrograms ? "Loading programs..." : "Search programs..."}
                />
              </div>
            ) : (
              <InputField
                label="Program ID"
                field="program"
                type="number"
                placeholder="e.g. 42"
                formData={form}
                errors={fieldErrors}
                updateFormData={update}
              />
            )}
            <InputField
              label="Program Price"
              field="program_price"
              placeholder="e.g. 2500.00"
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
