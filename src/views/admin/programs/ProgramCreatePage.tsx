// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCreateProgram from "hooks/programs/useCreateProgram";
import useCategories from "hooks/categories/useCategories";
import useLocations from "hooks/locations/useLocations";
import { useToast } from "context/ToastContext";
import InputField from "components/form/InputField";
import SelectField from "components/form/SelectField";
import TextareaField from "components/form/TextareaField";
import ToggleInput from "components/form/toggle/ToggleInput";

const TYPE_OPTIONS = [
  { value: "course",     label: "Training Course" },
  { value: "diploma",    label: "Training Diploma" },
  { value: "contracted", label: "Contracted Course" },
];
const LEVEL_OPTIONS = [
  { value: "beginner",     label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced",     label: "Advanced" },
];
const MODE_OPTIONS = [
  { value: "online",  label: "Online" },
  { value: "offline", label: "Offline" },
  { value: "hybrid",  label: "Hybrid" },
];
const STATUS_OPTIONS = [
  { value: "upcoming",  label: "Upcoming" },
  { value: "ongoing",   label: "Ongoing" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const ProgramCreatePage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { createProgram, loading, error, fieldErrors } = useCreateProgram();

  const { categories } = useCategories({ is_active: true, ordering: "display_order", type: "international_youth" });
  const { locations }  = useLocations({ is_active: true });

  const categoryOptions = categories.map((c) => ({ value: c.uid, label: c.name }));
  const locationOptions  = locations.map((l)  => ({ value: l.uid, label: `${l.name} — ${l.city}, ${l.country}` }));

  const [form, setForm] = useState({
    name:             "",
    description:      "",
    type:             "course",
    category:         "",
    location:         "",
    duration:         "",
    level:            "beginner",
    mode:             "offline",
    language:         "English",
    start_date:       "",
    end_date:         "",
    max_participants: "",
    brochure_url_en:  "",
    brochure_url_ar:  "",
    contact_email:    "",
    contact_phone:    "",
    status:           "upcoming",
    is_active:        true,
  });

  const updateFormData = (key: string, value: any) =>
    setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const created = await createProgram({
      ...form,
      max_participants: form.max_participants ? Number(form.max_participants) : null,
    });
    if (created) {
      addToast("Program created successfully", "success");
      navigate("/admin/programs");
    }
  };

  return (
    <div className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-100 dark:border-navy-700 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-navy-700">
        <h1 className="text-base font-bold text-navy-800 dark:text-white">Create Program</h1>
        <p className="text-xs text-gray-400 mt-0.5">Fill in the details to add a new training program</p>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-5">
        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">

          {/* Program name — full width */}
          <div className="md:col-span-2">
            <InputField
              label="Program Name"
              field="name"
              placeholder="e.g. Advanced Leadership Diploma"
              formData={form}
              errors={fieldErrors}
              updateFormData={updateFormData}
            />
          </div>

          {/* Type — full width */}
          <div className="md:col-span-2">
            <SelectField
              label="Program Type"
              field="type"
              options={TYPE_OPTIONS}
              formData={form}
              errors={fieldErrors}
              updateFormData={updateFormData}
            />
          </div>

          {/* Category + Location */}
          <SelectField
            label="Category"
            field="category"
            options={categoryOptions}
            formData={form}
            errors={fieldErrors}
            updateFormData={updateFormData}
          />
          <SelectField
            label="Location"
            field="location"
            options={locationOptions}
            formData={form}
            errors={fieldErrors}
            updateFormData={updateFormData}
          />

          {/* Duration + Language */}
          <InputField
            label="Duration"
            field="duration"
            placeholder="e.g. 10 Consecutive Days"
            formData={form}
            errors={fieldErrors}
            updateFormData={updateFormData}
          />
          <InputField
            label="Language"
            field="language"
            placeholder="e.g. English"
            formData={form}
            errors={fieldErrors}
            updateFormData={updateFormData}
          />

          {/* Level + Mode */}
          <SelectField
            label="Level"
            field="level"
            options={LEVEL_OPTIONS}
            formData={form}
            errors={fieldErrors}
            updateFormData={updateFormData}
          />
          <SelectField
            label="Mode"
            field="mode"
            options={MODE_OPTIONS}
            formData={form}
            errors={fieldErrors}
            updateFormData={updateFormData}
          />

          {/* Start Date + End Date */}
          <InputField
            label="Start Date"
            field="start_date"
            type="date"
            required={false}
            formData={form}
            errors={fieldErrors}
            updateFormData={updateFormData}
          />
          <InputField
            label="End Date"
            field="end_date"
            type="date"
            required={false}
            formData={form}
            errors={fieldErrors}
            updateFormData={updateFormData}
          />

          {/* Max Participants + Status */}
          <InputField
            label="Max Participants"
            field="max_participants"
            type="number"
            required={false}
            placeholder="e.g. 20"
            formData={form}
            errors={fieldErrors}
            updateFormData={updateFormData}
          />
          <SelectField
            label="Status"
            field="status"
            options={STATUS_OPTIONS}
            formData={form}
            errors={fieldErrors}
            updateFormData={updateFormData}
          />

          {/* Contact Email + Phone */}
          <InputField
            label="Contact Email"
            field="contact_email"
            type="email"
            required={false}
            placeholder="info@ika-edu.com"
            formData={form}
            errors={fieldErrors}
            updateFormData={updateFormData}
          />
          <InputField
            label="Contact Phone"
            field="contact_phone"
            type="tel"
            required={false}
            placeholder="+601139936766"
            formData={form}
            errors={fieldErrors}
            updateFormData={updateFormData}
          />

          {/* Brochure URLs */}
          <InputField
            label="Brochure URL (EN)"
            field="brochure_url_en"
            required={false}
            placeholder="https://..."
            formData={form}
            errors={fieldErrors}
            updateFormData={updateFormData}
          />
          <InputField
            label="Brochure URL (AR)"
            field="brochure_url_ar"
            required={false}
            placeholder="https://..."
            formData={form}
            errors={fieldErrors}
            updateFormData={updateFormData}
          />

          {/* Description — full width */}
          <div className="md:col-span-2">
            <TextareaField
              label="Description"
              field="description"
              required={false}
              rows={4}
              placeholder="Detailed description of the program content, objectives, and outcomes..."
              formData={form}
              errors={fieldErrors}
              updateFormData={updateFormData}
            />
          </div>

          {/* Active toggle — full width */}
          <div className="md:col-span-2">
            <ToggleInput
              label="Active"
              field="is_active"
              formData={form}
              errors={fieldErrors}
              updateFormData={updateFormData}
            />
          </div>

        </div>

        {/* Actions */}
        <div className="flex gap-2 border-t border-gray-100 pt-4 mt-2">
          <button
            type="button"
            onClick={() => navigate("/admin/programs")}
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-xl bg-navy-800 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 transition disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Program"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProgramCreatePage;
