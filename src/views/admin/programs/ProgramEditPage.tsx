// @ts-nocheck
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdPhotoCamera } from "react-icons/md";
import useGetProgram from "hooks/programs/useGetProgram";
import useUpdateProgram from "hooks/programs/useUpdateProgram";
import useFields from "hooks/fields/useFields";
import useLocations from "hooks/locations/useLocations";
import usePresignedUpload from "hooks/storage/usePresignedUpload";
import { useToast } from "context/ToastContext";
import InputField from "components/form/InputField";
import SelectField from "components/form/SelectField";
import TextareaField from "components/form/TextareaField";
import ToggleInput from "components/form/toggle/ToggleInput";

const ThumbnailUpload = ({ value, onChange }) => {
  const { upload, uploading, progress, error } = usePresignedUpload();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    const result = await upload(file, { folder: "programs/thumbnails", file_type: "image" });
    if (result) onChange(result.public_url);
  };

  return (
    <div>
      <label className="block text-xs font-semibold text-navy-700 mb-2">Thumbnail</label>
      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
          <img src={value} alt="Thumbnail" className="w-full h-40 object-cover" />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition"
          >
            <MdPhotoCamera size={24} className="text-white" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full h-32 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-navy-300 hover:text-navy-500 transition bg-slate-50"
        >
          <MdPhotoCamera size={22} />
          <span className="text-xs font-medium">Upload thumbnail</span>
          <span className="text-[10px] text-slate-300">JPG, PNG, WebP</span>
        </button>
      )}
      {uploading && (
        <div className="mt-2 space-y-1">
          <div className="h-1 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full bg-navy-500 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-slate-400 text-center">Uploading {progress}%</p>
        </div>
      )}
      {value && !uploading && (
        <div className="flex gap-3 mt-2">
          <button type="button" onClick={() => inputRef.current?.click()}
            className="text-xs text-navy-600 hover:text-navy-800 font-medium transition">
            Change
          </button>
          <button type="button" onClick={() => onChange("")}
            className="text-xs text-red-500 hover:text-red-700 transition">
            Remove
          </button>
        </div>
      )}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp"
        className="hidden" onChange={handleChange} />
    </div>
  );
};

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
const CURRENCY_OPTIONS = [
  { value: "MYR", label: "MYR — Malaysian Ringgit" },
  { value: "USD", label: "USD — US Dollar" },
  { value: "EUR", label: "EUR — Euro" },
  { value: "GBP", label: "GBP — British Pound" },
  { value: "AED", label: "AED — UAE Dirham" },
  { value: "SAR", label: "SAR — Saudi Riyal" },
];

const ProgramEditPage = () => {
  const { uid } = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const { program, loading: loadingProgram, error: loadError } = useGetProgram(uid);
  const { updateProgram, loading: updating, error, fieldErrors } = useUpdateProgram();

  const { fields }    = useFields({ is_active: true });
  const { locations } = useLocations({ is_active: true });

  const fieldOptions    = fields.map((f) => ({ value: f.uid, label: f.name }));
  const locationOptions = locations.map((l) => ({ value: l.uid, label: `${l.name} — ${l.city}, ${l.country}` }));

  const [form, setForm] = useState({
    name:             "",
    description:      "",
    objectives:       "",
    target_audience:  "",
    prerequisites:    "",
    program_type:     "course",
    field:            "",
    location:         "",
    duration:         "",
    level:            "beginner",
    mode:             "offline",
    language:         "English",
    start_date:       "",
    end_date:         "",
    max_participants: "",
    brochure_url:     "",
    contact_email:    "",
    contact_phone:    "",
    status:           "upcoming",
    is_active:        true,
    price:            "",
    currency:         "MYR",
    thumbnail:        "",
  });

  useEffect(() => {
    if (program) {
      setForm({
        name:             program.name,
        description:      program.description ?? "",
        objectives:       program.objectives ?? "",
        target_audience:  program.target_audience ?? "",
        prerequisites:    program.prerequisites ?? "",
        program_type:     program.program_type,
        field:            program.field?.uid ?? "",
        location:         program.location?.uid ?? "",
        duration:         program.duration ?? "",
        level:            program.level,
        mode:             program.mode,
        language:         program.language ?? "English",
        start_date:       program.start_date ?? "",
        end_date:         program.end_date ?? "",
        max_participants: program.max_participants != null ? String(program.max_participants) : "",
        brochure_url:     program.brochure_url ?? "",
        contact_email:    program.contact_email ?? "",
        contact_phone:    program.contact_phone ?? "",
        status:           program.status,
        is_active:        program.is_active,
        price:            program.price ?? "",
        currency:         program.currency ?? "MYR",
        thumbnail:        program.thumbnail ?? "",
      });
    }
  }, [program]);

  const updateFormData = (key: string, value: any) =>
    setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updated = await updateProgram(uid, {
      ...form,
      max_participants: form.max_participants ? Number(form.max_participants) : null,
      field:    form.field    || undefined,
      location: form.location || undefined,
    });
    if (updated) {
      addToast("Program updated successfully", "success");
      navigate("/admin/programs");
    }
  };

  if (loadingProgram) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-slate-400">
        Loading program...
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
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm max-w-5xl mx-auto">
      <div className="px-6 py-4 border-b border-slate-100">
        <h1 className="text-base font-bold text-navy-800">Edit Program</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Updating{" "}
          <span className="font-semibold text-navy-700">{program?.name}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-5">
        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">

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

          <div className="md:col-span-2">
            <SelectField
              label="Program Type"
              field="program_type"
              options={TYPE_OPTIONS}
              formData={form}
              errors={fieldErrors}
              updateFormData={updateFormData}
            />
          </div>

          <SelectField
            label="Field"
            field="field"
            options={fieldOptions}
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

          <InputField
            label="Price"
            field="price"
            type="text"
            required={false}
            placeholder="e.g. 1500.00"
            formData={form}
            errors={fieldErrors}
            updateFormData={updateFormData}
          />
          <SelectField
            label="Currency"
            field="currency"
            options={CURRENCY_OPTIONS}
            formData={form}
            errors={fieldErrors}
            updateFormData={updateFormData}
          />

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

          <div className="md:col-span-2">
            <InputField
              label="Brochure URL"
              field="brochure_url"
              required={false}
              placeholder="https://..."
              formData={form}
              errors={fieldErrors}
              updateFormData={updateFormData}
            />
          </div>

          <div className="md:col-span-2">
            <TextareaField
              label="Description"
              field="description"
              required={false}
              rows={3}
              placeholder="Detailed description of the program content..."
              formData={form}
              errors={fieldErrors}
              updateFormData={updateFormData}
            />
          </div>

          <div className="md:col-span-2">
            <TextareaField
              label="Objectives"
              field="objectives"
              required={false}
              rows={3}
              placeholder="What participants will achieve..."
              formData={form}
              errors={fieldErrors}
              updateFormData={updateFormData}
            />
          </div>

          <TextareaField
            label="Target Audience"
            field="target_audience"
            required={false}
            rows={3}
            placeholder="Who this program is for..."
            formData={form}
            errors={fieldErrors}
            updateFormData={updateFormData}
          />
          <TextareaField
            label="Prerequisites"
            field="prerequisites"
            required={false}
            rows={3}
            placeholder="Requirements before joining..."
            formData={form}
            errors={fieldErrors}
            updateFormData={updateFormData}
          />

          {/* Thumbnail — full width */}
          <div className="md:col-span-2">
            <ThumbnailUpload
              value={form.thumbnail}
              onChange={(url) => updateFormData("thumbnail", url)}
            />
          </div>

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

        <div className="flex gap-2 border-t border-slate-100 pt-4 mt-2">
          <button
            type="button"
            onClick={() => navigate("/admin/programs")}
            className="flex-1 rounded-md lg:rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updating}
            className="flex-1 rounded-md lg:rounded-lg bg-navy-800 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 transition disabled:opacity-60"
          >
            {updating ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProgramEditPage;
