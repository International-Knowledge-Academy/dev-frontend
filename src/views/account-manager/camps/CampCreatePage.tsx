// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "context/ToastContext";
import useCreateCamp from "hooks/camps/useCreateCamp";
import useAllLocations from "hooks/locations/useAllLocations";
import PageHeader from "components/ui/PageHeader";
import InputField from "components/form/InputField";
import TextareaField from "components/form/TextareaField";
import SearchableSelect from "components/form/SearchableSelect";
import Button from "components/ui/buttons/Button";

const STATUS_OPTIONS = [
  { value: "upcoming",  label: "Upcoming" },
  { value: "open",      label: "Open for Registration" },
  { value: "closed",    label: "Closed for Registration" },
  { value: "completed", label: "Completed" },
];

const SectionLabel = ({ children }) => (
  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">
    {children}
  </p>
);

const CampCreatePage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { createCamp, loading, error } = useCreateCamp();
  const { locations } = useAllLocations();
  const locationOptions = locations.map((l) => ({ value: l.name, label: l.name }));

  const [form, setForm] = useState({
    name:        "",
    status:      "upcoming",
    description: "",
    highlights:  "",
    location:    "",
    start_date:  "",
    end_date:    "",
    deadline:    "",
    capacity:    "",
    camp_fee:    "",
    min_age:     "",
    max_age:     "",
  });

  const update = (key: string, val: any) => setForm((p) => ({ ...p, [key]: val }));

  const isFormValid = form.name.trim() !== "" && form.status !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload: any = { name: form.name.trim(), status: form.status };
    if (form.description) payload.description = form.description;
    if (form.highlights)  payload.highlights  = form.highlights;
    if (form.location)    payload.location    = form.location;
    if (form.start_date)  payload.start_date  = form.start_date;
    if (form.end_date)    payload.end_date    = form.end_date;
    if (form.deadline)    payload.deadline    = form.deadline;
    if (form.capacity)    payload.capacity    = Number(form.capacity);
    if (form.camp_fee)    payload.camp_fee    = form.camp_fee;
    if (form.min_age)     payload.min_age     = Number(form.min_age);
    if (form.max_age)     payload.max_age     = Number(form.max_age);

    const camp = await createCamp(payload);
    if (camp) {
      addToast("Club created successfully.", "success");
      navigate("/account-manager/clubs");
    } else {
      addToast(error ?? "Failed to create club.", "error");
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <PageHeader
          title="Create Club"
          subtitle="Fill in the details to add a new club"
          bordered
        />

        <form onSubmit={handleSubmit} className="px-6 py-5 grid grid-cols-1 gap-4">
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Basic Info */}
          <SectionLabel>Basic Info</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Club Name"
              field="name"
              required
              placeholder="Summer Sports Camp 2025"
              formData={form}
              errors={{}}
              updateFormData={update}
            />
            <SearchableSelect
              label="Status"
              field="status"
              required
              options={STATUS_OPTIONS}
              formData={form}
              errors={{}}
              updateFormData={update}
              placeholder="Select status..."
            />
          </div>

          {/* Description */}
          <SectionLabel>Description</SectionLabel>
          <TextareaField
            label="Description"
            field="description"
            required={false}
            rows={3}
            placeholder="Describe the club program..."
            formData={form}
            errors={{}}
            updateFormData={update}
          />
          <TextareaField
            label="Highlights"
            field="highlights"
            required={false}
            rows={3}
            placeholder="Key highlights or activities..."
            formData={form}
            errors={{}}
            updateFormData={update}
          />

          {/* Schedule */}
          <SectionLabel>Schedule</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputField label="Start Date" field="start_date" type="date" required={false} formData={form} errors={{}} updateFormData={update} />
            <InputField label="End Date"   field="end_date"   type="date" required={false} formData={form} errors={{}} updateFormData={update} />
            <InputField label="Deadline"   field="deadline"   type="date" required={false} formData={form} errors={{}} updateFormData={update} />
          </div>

          {/* Details */}
          <SectionLabel>Details</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SearchableSelect label="Location" field="location" required={false} options={locationOptions} formData={form} errors={{}} updateFormData={update} placeholder="Select location..." />
            <InputField label="Capacity"  field="capacity" type="number" required={false} placeholder="50" formData={form} errors={{}} updateFormData={update} />
            <InputField label="Camp Fee"  field="camp_fee" required={false} placeholder="30.00" formData={form} errors={{}} updateFormData={update} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Minimum Age" field="min_age" type="number" required={false} placeholder="6"  formData={form} errors={{}} updateFormData={update} />
            <InputField label="Maximum Age" field="max_age" type="number" required={false} placeholder="16" formData={form} errors={{}} updateFormData={update} />
          </div>

          <div className="flex gap-2 border-t border-slate-100 pt-5">
            <Button
              type="button"
              text="Cancel"
              onClick={() => navigate("/account-manager/clubs")}
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
              text={loading ? "Creating..." : "Create Club"}
              disabled={loading || !isFormValid}
              className="flex-1 py-2.5"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CampCreatePage;
