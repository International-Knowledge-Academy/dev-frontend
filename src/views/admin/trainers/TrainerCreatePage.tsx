// @ts-nocheck
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Camera } from "lucide-react";
import useCreateTrainer from "hooks/trainers/useCreateTrainer";
import usePresignedUpload from "hooks/storage/usePresignedUpload";
import { useToast } from "context/ToastContext";
import InputField from "components/form/InputField";
import TextareaField from "components/form/TextareaField";
import SearchableDropdown from "components/form/search/SearchableDropdown";
import FileUploadField from "components/form/filesUpload/FileUploadField";
import type { PresignedUploadResult } from "hooks/storage/usePresignedUpload";
import { COUNTRIES } from "constants/lists";

const COUNTRY_OPTIONS = COUNTRIES.map((c) => ({ value: c.name, label: c.name }));

const AvatarUpload = ({ displayUrl, name, onChange, onUploadError }) => {
  const { upload, uploading, progress, error, reset } = usePresignedUpload();
  const inputRef = useRef<HTMLInputElement>(null);

  const initials = name
    ? name.split(" ").filter(Boolean).map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const handleChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    const result = await upload(file, { folder: "trainers/profile-pictures", file_type: "image" });
    if (result) { onChange(result); reset(); }
    else { onUploadError?.("Failed to upload profile picture. Please try again."); }
  };

  return (
    <div className="flex flex-col items-center gap-3 py-6 border-b border-slate-100">
      <div className="relative group">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-slate-100 focus:outline-none focus:ring-navy-200 transition"
        >
          {displayUrl ? (
            <img src={displayUrl} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-navy-600 flex items-center justify-center text-white text-2xl font-bold select-none">
              {initials}
            </div>
          )}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition rounded-full">
            <Camera size={22} className="text-white" />
          </div>
        </button>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="absolute bottom-0.5 right-0.5 w-7 h-7 bg-navy-600 hover:bg-navy-700 rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm transition"
        >
          <Camera size={12} />
        </button>
      </div>

      {uploading && (
        <div className="w-28 space-y-1">
          <div className="h-1 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full rounded-full bg-gold-500 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-slate-400 text-center">Uploading {progress}%</p>
        </div>
      )}

      {!uploading && (
        <button type="button" onClick={() => inputRef.current?.click()}
          className="text-xs text-navy-600 hover:text-navy-800 transition font-medium">
          {displayUrl ? "Change photo" : "Upload photo"}
        </button>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp"
        className="hidden" onChange={handleChange} />
    </div>
  );
};

const TrainerCreatePage = () => {
  const navigate     = useNavigate();
  const { addToast } = useToast();
  const { createTrainer, loading, error, fieldErrors } = useCreateTrainer();
  const { upload: uploadCvFile, uploading: uploadingCv, progress: cvProgress } = usePresignedUpload();

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

  const [profilePictureKey, setProfilePictureKey] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvKey,  setCvKey]  = useState("");

  const update = (key: string, value: any) =>
    setForm((p) => ({ ...p, [key]: value }));

  const handlePicChange = ({ file_key, public_url }: PresignedUploadResult) => {
    setProfilePictureKey(file_key);
    setProfilePictureUrl(public_url);
  };

  const handleCvFileChange = async (file: File) => {
    setCvFile(file);
    const uploaded = await uploadCvFile(file, { folder: "trainers/cvs", file_type: "document" });
    if (uploaded) {
      setCvKey(uploaded.file_key);
    } else {
      setCvFile(null);
    }
  };

  const handleCvRemove = () => {
    setCvFile(null);
    setCvKey("");
  };

  const isFormValid =
    form.name.trim() !== "" &&
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
      profile_picture:  profilePictureKey     || undefined,
      cv:               cvKey                 || undefined,
    };
    const { trainer: created, fieldErrors: fe, error: ge } = await createTrainer(payload);
    if (!created) {
      const firstFieldError = Object.values(fe)[0];
      addToast(firstFieldError ?? ge ?? "Failed to create trainer. Please try again.", "error");
      return;
    }
    addToast("Trainer created successfully", "success");
    navigate("/admin/trainers");
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm max-w-5xl mx-auto">
      <div className="px-6 py-4 border-b border-slate-100">
        <h1 className="text-base font-bold text-navy-800">Add Trainer</h1>
        <p className="text-xs text-slate-400 mt-0.5">Register a new trainer profile</p>
      </div>

      <AvatarUpload
        displayUrl={profilePictureUrl}
        name={form.name}
        onChange={handlePicChange}
        onUploadError={(msg) => addToast(msg, "error")}
      />

      <form onSubmit={handleSubmit} className="px-6 py-5">
        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">

          <InputField label="Full Name" field="name" placeholder="Jane Smith"
            formData={form} errors={fieldErrors} updateFormData={update} />
          <InputField label="Email" field="email" type="email" placeholder="jane@example.com"
            formData={form} errors={fieldErrors} updateFormData={update} />

          <InputField label="Phone" field="phone" placeholder="+971 50 000 0000"
            required={false} formData={form} errors={fieldErrors} updateFormData={update} />
          <InputField label="WhatsApp" field="whatsapp" placeholder="+971 50 000 0000"
            required={false} formData={form} errors={fieldErrors} updateFormData={update} />

          <InputField label="Job Title" field="title" placeholder="Senior Consultant"
            formData={form} errors={fieldErrors} updateFormData={update} />
          <InputField label="Years of Experience" field="years_experience" type="number"
            placeholder="5" required={false} formData={form} errors={fieldErrors} updateFormData={update} />

          <div className="md:col-span-2">
            <TextareaField label="Bio" field="bio" required={false} rows={3}
              placeholder="Brief professional background..."
              formData={form} errors={fieldErrors} updateFormData={update} />
          </div>

          <div className="md:col-span-2">
            <InputField label="Certifications" field="certifications"
              placeholder="PMP, SHRM, ISO Lead Auditor..."
              required={false} formData={form} errors={fieldErrors} updateFormData={update} />
          </div>

          <div className="md:col-span-2">
            <InputField label="LinkedIn URL" field="linkedin_url"
              placeholder="https://linkedin.com/in/..."
              required={false} formData={form} errors={fieldErrors} updateFormData={update} />
          </div>

          <InputField label="Primary Email" field="primary_email" type="email"
            placeholder="primary@example.com"
            required={false} formData={form} errors={fieldErrors} updateFormData={update} />
          <InputField label="Secondary Email" field="secondary_email" type="email"
            placeholder="secondary@example.com"
            required={false} formData={form} errors={fieldErrors} updateFormData={update} />

          <SearchableDropdown label="Country" field="country" required={false}
            options={COUNTRY_OPTIONS} formData={form} errors={fieldErrors}
            updateFormData={update} placeholder="Select country..." />
          <InputField label="City" field="city" placeholder="Dubai"
            required={false} formData={form} errors={fieldErrors} updateFormData={update} />

          <InputField label="Postal Code" field="postal_code" placeholder="00000"
            required={false} formData={form} errors={fieldErrors} updateFormData={update} />
          <InputField label="Address" field="address" placeholder="123 Main St"
            required={false} formData={form} errors={fieldErrors} updateFormData={update} />

          <div className="md:col-span-2">
            <FileUploadField
              label="CV / Resume"
              field="cv"
              simpleFile={cvFile}
              onSimpleFileChange={handleCvFileChange}
              onSimpleRemove={handleCvRemove}
              simpleUploading={uploadingCv}
              simpleProgress={cvProgress}
              errors={fieldErrors}
            />
          </div>

        </div>

        <div className="flex gap-2 border-t border-slate-100 pt-4 mt-2">
          <button
            type="button"
            onClick={() => navigate("/admin/trainers")}
            className="flex-1 rounded-md lg:rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !isFormValid}
            className="flex-1 rounded-md lg:rounded-lg bg-navy-800 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 transition disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Trainer"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TrainerCreatePage;
