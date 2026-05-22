// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCreateTrainer from "hooks/trainers/useCreateTrainer";
import { useToast } from "context/ToastContext";
import InputField from "components/form/InputField";
import Button from "components/ui/buttons/Button";
import PageHeader from "components/ui/PageHeader";

const SectionTitle = ({ title }) => (
  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 px-4 sm:px-6 pt-5 pb-2 border-t border-slate-100 first:border-t-0">
    {title}
  </p>
);

const TrainerCreatePage = () => {
  const navigate     = useNavigate();
  const { addToast } = useToast();
  const { createTrainer, loading, error, fieldErrors } = useCreateTrainer();

  const [form, setForm] = useState({
    name:             "",
    email:            "",
    phone:            "",
    title:            "",
    bio:              "",
    years_experience: "",
    certifications:   "",
    linkedin_url:     "",
    primary_email:    "",
    secondary_email:  "",
    address:          "",
    country:          "",
    city:             "",
    postal_code:      "",
    whatsapp:         "",
  });

  const update = (key: string, value: any) =>
    setForm((p) => ({ ...p, [key]: value }));

  const isFormValid =
    form.name.trim()  !== "" &&
    form.email.trim() !== "" &&
    form.title.trim() !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name:             form.name,
      email:            form.email,
      phone:            form.phone            || undefined,
      title:            form.title            || undefined,
      bio:              form.bio              || undefined,
      years_experience: form.years_experience ? Number(form.years_experience) : undefined,
      certifications:   form.certifications   || undefined,
      linkedin_url:     form.linkedin_url     || undefined,
      primary_email:    form.primary_email    || undefined,
      secondary_email:  form.secondary_email  || undefined,
      address:          form.address          || undefined,
      country:          form.country          || undefined,
      city:             form.city             || undefined,
      postal_code:      form.postal_code      || undefined,
      whatsapp:         form.whatsapp         || undefined,
    };
    const created = await createTrainer(payload);
    if (!created) return;
    addToast("Trainer created successfully", "success");
    navigate("/account-manager/trainers");
  };

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title="Add Trainer"
        subtitle="Register a new trainer profile"
        className="mb-4 px-0 sm:px-0"
      />

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit}>

          {/* ── Basic Info ── */}
          <SectionTitle title="Basic Information" />
          <div className="px-4 sm:px-6 pb-2">
            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600 mb-4">
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <InputField
                label="Full Name"
                field="name"
                placeholder="Jane Smith"
                formData={form}
                errors={fieldErrors}
                updateFormData={update}
              />
              <InputField
                label="Email"
                field="email"
                type="email"
                placeholder="jane@example.com"
                formData={form}
                errors={fieldErrors}
                updateFormData={update}
              />
              <InputField
                label="Phone"
                field="phone"
                placeholder="+971 50 000 0000"
                required={false}
                formData={form}
                errors={fieldErrors}
                updateFormData={update}
              />
              <InputField
                label="WhatsApp"
                field="whatsapp"
                placeholder="+971 50 000 0000"
                required={false}
                formData={form}
                errors={fieldErrors}
                updateFormData={update}
              />
              <InputField
                label="Job Title"
                field="title"
                placeholder="Senior Consultant"
                formData={form}
                errors={fieldErrors}
                updateFormData={update}
              />
              <InputField
                label="Years of Experience"
                field="years_experience"
                type="number"
                placeholder="5"
                required={false}
                formData={form}
                errors={fieldErrors}
                updateFormData={update}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-navy-800 mb-1.5">
                Bio <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={form.bio}
                onChange={(e) => update("bio", e.target.value)}
                placeholder="Brief professional background..."
                rows={3}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-navy-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-navy-200 focus:border-navy-400 transition resize-none"
              />
            </div>

            <InputField
              label="Certifications"
              field="certifications"
              placeholder="PMP, SHRM, ISO Lead Auditor..."
              required={false}
              formData={form}
              errors={fieldErrors}
              updateFormData={update}
            />
            <InputField
              label="LinkedIn URL"
              field="linkedin_url"
              placeholder="https://linkedin.com/in/..."
              required={false}
              formData={form}
              errors={fieldErrors}
              updateFormData={update}
            />
          </div>

          {/* ── Contact Emails ── */}
          <SectionTitle title="Contact Emails" />
          <div className="px-4 sm:px-6 pb-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <InputField
                label="Primary Email"
                field="primary_email"
                type="email"
                placeholder="primary@example.com"
                required={false}
                formData={form}
                errors={fieldErrors}
                updateFormData={update}
              />
              <InputField
                label="Secondary Email"
                field="secondary_email"
                type="email"
                placeholder="secondary@example.com"
                required={false}
                formData={form}
                errors={fieldErrors}
                updateFormData={update}
              />
            </div>
          </div>

          {/* ── Location ── */}
          <SectionTitle title="Location" />
          <div className="px-4 sm:px-6 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <InputField
                label="Country"
                field="country"
                placeholder="United Arab Emirates"
                required={false}
                formData={form}
                errors={fieldErrors}
                updateFormData={update}
              />
              <InputField
                label="City"
                field="city"
                placeholder="Dubai"
                required={false}
                formData={form}
                errors={fieldErrors}
                updateFormData={update}
              />
              <InputField
                label="Postal Code"
                field="postal_code"
                placeholder="00000"
                required={false}
                formData={form}
                errors={fieldErrors}
                updateFormData={update}
              />
              <InputField
                label="Address"
                field="address"
                placeholder="123 Main St"
                required={false}
                formData={form}
                errors={fieldErrors}
                updateFormData={update}
              />
            </div>
          </div>

          {/* ── Actions ── */}
          <div className="flex gap-2 border-t border-slate-100 px-4 sm:px-6 py-5">
            <Button
              type="button"
              text="Cancel"
              onClick={() => navigate("/account-manager/trainers")}
              className="flex-1 py-2.5"
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
              text={loading ? "Creating..." : "Create Trainer"}
              disabled={loading || !isFormValid}
              className="flex-1 py-2.5"
            />
          </div>

        </form>
      </div>
    </div>
  );
};

export default TrainerCreatePage;
