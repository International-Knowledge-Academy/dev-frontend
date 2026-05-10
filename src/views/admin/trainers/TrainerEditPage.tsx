// @ts-nocheck
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Camera } from "lucide-react";
import useTrainer from "hooks/trainers/useTrainer";
import useUpdateTrainer from "hooks/trainers/useUpdateTrainer";
import usePresignedUpload from "hooks/storage/usePresignedUpload";
import { useToast } from "context/ToastContext";
import InputField from "components/form/InputField";
import TextareaField from "components/form/TextareaField";
import SearchableDropdown from "components/form/search/SearchableDropdown";
import Button from "components/ui/buttons/Button";
import FileUploadField from "components/form/filesUpload/FileUploadField";
import type { PresignedUploadResult } from "hooks/storage/usePresignedUpload";
import { COUNTRIES } from "constants/lists";

const COUNTRY_OPTIONS = COUNTRIES.map((c) => ({ value: c.name, label: c.name }));

const SectionTitle = ({ title }) => (
  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 px-4 sm:px-6 pt-5 pb-2 border-t border-slate-100 first:border-t-0">
    {title}
  </p>
);

// ── Avatar upload widget ──────────────────────────────────────────────────────
const AvatarUpload = ({
  displayUrl,
  name,
  onChange,
  onUploadError,
}: {
  displayUrl: string;
  name: string;
  onChange: (result: PresignedUploadResult) => void;
  onUploadError?: (msg: string) => void;
}) => {
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
          className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-slate-100 focus:outline-none focus:ring-navy-200 transition"
          disabled={uploading}
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

// ── Page ──────────────────────────────────────────────────────────────────────
const TrainerEditPage = () => {
  const { uid }  = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const { trainer, loading: loadingTrainer, error: loadError, refetch } = useTrainer(uid);
  const { updateTrainer, loading: updating, error, fieldErrors, getLastError } = useUpdateTrainer();
  const { upload: uploadCvFile, uploading: uploadingCv }                = usePresignedUpload();

  const [cvFile,            setCvFile]            = useState<File | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState("");

  const [form, setForm] = useState({
    name: "", email: "", phone: "", whatsapp: "",
    title: "", years_experience: "", bio: "",
    certifications: "", linkedin_url: "", primary_email: "", secondary_email: "",
    country: "", city: "", postal_code: "", address: "",
  });

  useEffect(() => {
    if (trainer) {
      setForm({
        name:             trainer.name             ?? "",
        email:            trainer.email            ?? "",
        phone:            trainer.phone            ?? "",
        whatsapp:         trainer.whatsapp         ?? "",
        title:            trainer.title            ?? "",
        years_experience: trainer.years_experience != null ? String(trainer.years_experience) : "",
        bio:              trainer.bio              ?? "",
        certifications:   trainer.certifications   ?? "",
        linkedin_url:     trainer.linkedin_url     ?? "",
        primary_email:    trainer.primary_email    ?? "",
        secondary_email:  trainer.secondary_email  ?? "",
        country:          trainer.country          ?? "",
        city:             trainer.city             ?? "",
        postal_code:      trainer.postal_code      ?? "",
        address:          trainer.address          ?? "",
      });
      setProfilePictureUrl(trainer.profile_picture?.public_url ?? "");
    }
  }, [trainer]);

  const update = (key: string, value: any) => setForm((p) => ({ ...p, [key]: value }));

  const handleCvFileChange = async (file: File) => {
    setCvFile(file);
    const uploaded = await uploadCvFile(file, { folder: "trainers/cvs", file_type: "document" });
    setCvFile(null);
    if (uploaded) {
      const result = await updateTrainer(uid, { cv: uploaded.file_key });
      if (result) { addToast("CV updated successfully", "success"); refetch(); }
      else { addToast("Failed to update CV. Please try again.", "error"); }
    } else {
      addToast("Failed to upload CV. Please try again.", "error");
    }
  };

  const handleCvRemove = async () => {
    const result = await updateTrainer(uid, { cv: "" });
    if (result) { addToast("CV removed", "success"); refetch(); }
    else { addToast("Failed to remove CV. Please try again.", "error"); }
  };

  const handlePicChange = async ({ file_key, public_url }: PresignedUploadResult) => {
    setProfilePictureUrl(public_url);
    const result = await updateTrainer(uid, { profile_picture: file_key });
    if (result) { addToast("Profile picture updated", "success"); refetch(); }
    else { addToast("Failed to update profile picture. Please try again.", "error"); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateTrainer(uid, {
      name:             form.name            || undefined,
      email:            form.email           || undefined,
      phone:            form.phone           || undefined,
      whatsapp:         form.whatsapp        || undefined,
      title:            form.title           || undefined,
      years_experience: form.years_experience ? Number(form.years_experience) : undefined,
      bio:              form.bio             || undefined,
      certifications:   form.certifications  || undefined,
      linkedin_url:     form.linkedin_url    || undefined,
      primary_email:    form.primary_email   || undefined,
      secondary_email:  form.secondary_email || undefined,
      country:          form.country         || undefined,
      city:             form.city            || undefined,
      postal_code:      form.postal_code     || undefined,
      address:          form.address         || undefined,
    });
    if (result) {
      addToast("Trainer updated successfully", "success");
      navigate("/admin/trainers");
    } else {
      const { fieldErrors: fe, error: ge } = getLastError();
      const firstFieldError = Object.values(fe)[0];
      addToast(firstFieldError ?? ge ?? "Failed to save changes. Please try again.", "error");
    }
  };

  if (loadingTrainer) return (
    <div className="flex items-center justify-center py-20 text-sm text-slate-400">Loading trainer...</div>
  );
  if (loadError) return (
    <div className="flex items-center justify-center py-20 text-sm text-red-500">{loadError}</div>
  );

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-slate-100">
          <h1 className="text-base font-bold text-navy-800">Edit Trainer</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Update the details for <span className="font-semibold text-navy-700">{trainer?.name}</span>
          </p>
        </div>

        {/* Avatar */}
        <AvatarUpload displayUrl={profilePictureUrl} name={form.name} onChange={handlePicChange} onUploadError={(msg) => addToast(msg, "error")} />

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
              <InputField label="Full Name"  field="name"  placeholder="Jane Smith"          formData={form} errors={fieldErrors} updateFormData={update} />
              <InputField label="Email"      field="email" type="email" placeholder="jane@example.com" formData={form} errors={fieldErrors} updateFormData={update} />
              <InputField label="Phone"      field="phone" placeholder="+971 50 000 0000" required={false} formData={form} errors={fieldErrors} updateFormData={update} />
              <InputField label="WhatsApp"   field="whatsapp" placeholder="+971 50 000 0000" required={false} formData={form} errors={fieldErrors} updateFormData={update} />
              <InputField label="Job Title"  field="title" placeholder="Senior Consultant"   required={false} formData={form} errors={fieldErrors} updateFormData={update} />
              <InputField label="Years of Experience" field="years_experience" type="number" placeholder="5" required={false} formData={form} errors={fieldErrors} updateFormData={update} />
            </div>
            <TextareaField
              label="Bio"
              field="bio"
              required={false}
              rows={3}
              placeholder="Brief professional background..."
              formData={form}
              errors={fieldErrors}
              updateFormData={update}
            />
            <InputField label="Certifications" field="certifications" placeholder="PMP, SHRM..." required={false} formData={form} errors={fieldErrors} updateFormData={update} />
            <InputField label="LinkedIn URL"   field="linkedin_url"  placeholder="https://linkedin.com/in/..." required={false} formData={form} errors={fieldErrors} updateFormData={update} />
          </div>

          {/* ── Contact Emails ── */}
          <SectionTitle title="Contact Emails" />
          <div className="px-4 sm:px-6 pb-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <InputField label="Primary Email"   field="primary_email"   type="email" placeholder="primary@example.com"   required={false} formData={form} errors={fieldErrors} updateFormData={update} />
              <InputField label="Secondary Email" field="secondary_email" type="email" placeholder="secondary@example.com" required={false} formData={form} errors={fieldErrors} updateFormData={update} />
            </div>
          </div>

          {/* ── Location ── */}
          <SectionTitle title="Location" />
          <div className="px-4 sm:px-6 pb-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <SearchableDropdown label="Country" field="country" required={false} options={COUNTRY_OPTIONS} formData={form} errors={fieldErrors} updateFormData={update} placeholder="Select country..." />
              <InputField label="City"        field="city"        placeholder="Dubai"                required={false} formData={form} errors={fieldErrors} updateFormData={update} />
              <InputField label="Postal Code" field="postal_code" placeholder="00000"               required={false} formData={form} errors={fieldErrors} updateFormData={update} />
              <InputField label="Address"     field="address"     placeholder="123 Main St"          required={false} formData={form} errors={fieldErrors} updateFormData={update} />
            </div>
          </div>

          {/* ── CV ── */}
          <SectionTitle title="CV / Resume" />
          <div className="px-4 sm:px-6 pb-4">
            <FileUploadField
              field="cv"
              simpleFile={cvFile}
              onSimpleFileChange={handleCvFileChange}
              onSimpleRemove={() => setCvFile(null)}
              simpleUploading={uploadingCv}
              existingFileUrl={trainer?.cv?.public_url || null}
              existingFileName="Current CV"
              onExistingRemove={handleCvRemove}
              errors={fieldErrors}
            />
          </div>

          {/* ── Actions ── */}
          <div className="flex gap-2 border-t border-slate-100 px-4 sm:px-6 py-5">
            <Button
              type="button" text="Cancel"
              onClick={() => navigate("/admin/trainers")}
              className="flex-1 py-2.5"
              bgColor="bg-white" textColor="text-slate-600" borderColor="border-slate-200"
              hoverBgColor="hover:bg-slate-50" hoverTextColor="" hoverBorderColor=""
            />
            <Button
              type="submit" variant="primary"
              text={updating ? "Saving..." : "Save Changes"}
              disabled={updating || !form.name.trim() || !form.email.trim()}
              className="flex-1 py-2.5"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrainerEditPage;
