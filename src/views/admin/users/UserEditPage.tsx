// @ts-nocheck
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdPhotoCamera } from "react-icons/md";
import useGetUser from "hooks/users/useGetUser";
import useUpdateUser from "hooks/users/useUpdateUser";
import useUpdateProfile from "hooks/users/useUpdateProfile";
import useUploadCV from "hooks/users/profile/useUploadCV";
import useUpdateCV from "hooks/users/profile/useUpdateCV";
import useDeleteCV from "hooks/users/profile/useDeleteCV";
import usePresignedUpload from "hooks/storage/usePresignedUpload";
import { useToast } from "context/ToastContext";
import InputField from "components/form/InputField";
import TextareaField from "components/form/TextareaField";
import SelectField from "components/form/SelectField";
import CompactToggle from "components/form/toggle/CompactToggle";
import Button from "components/ui/buttons/Button";
import FileUploadField from "components/form/filesUpload/FileUploadField";
import { COUNTRIES } from "constants/lists";
import SearchableSelect from "components/form/SearchableSelect";

// ── Avatar upload widget ───────────────────────────────────────────────────
const AvatarUpload = ({ value, name, onChange }) => {
  const { upload, uploading, progress, error, reset } = usePresignedUpload();
  const inputRef = useRef<HTMLInputElement>(null);

  const initials = name
    ? name.split(" ").filter(Boolean).map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const handleChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    const result = await upload(file, { folder: "users/profiles", file_type: "image" });
    if (result) { onChange(result.public_url); reset(); }
  };

  return (
    <div className="flex flex-col items-center gap-3 py-6 border-b border-slate-100">
      {/* Avatar circle */}
      <div className="relative group">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-slate-100 focus:outline-none focus:ring-navy-200 transition"
          disabled={uploading}
        >
          {value ? (
            <img src={value} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-navy-700 flex items-center justify-center text-white text-2xl font-bold select-none">
              {initials}
            </div>
          )}
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition rounded-full">
            <MdPhotoCamera size={22} className="text-white" />
          </div>
        </button>

        {/* Camera badge */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="absolute bottom-0.5 right-0.5 w-7 h-7 bg-navy-600 hover:bg-navy-700 rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm transition"
        >
          <MdPhotoCamera size={12} />
        </button>
      </div>

      {/* Progress */}
      {uploading && (
        <div className="w-28 space-y-1">
          <div className="h-1 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-navy-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 text-center">Uploading {progress}%</p>
        </div>
      )}

      {/* Action text */}
      {!uploading && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-xs text-navy-600 hover:text-navy-800 transition font-medium"
        >
          {value ? "Change photo" : "Upload photo"}
        </button>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
};

// ── Section label ─────────────────────────────────────────────────────────
const SectionLabel = ({ children }) => (
  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">{children}</p>
);

// ── Page ──────────────────────────────────────────────────────────────────
const ROLES = [
  { value: "admin",           label: "Admin" },
  { value: "account_manager", label: "Account Manager" },
  { value: "trainer",         label: "Trainer" },
];

const UserEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const { user, loading: loadingUser, error: loadError, refetch } = useGetUser(id);
  const { updateUser,    loading: updating,        error: updateError,  fieldErrors }              = useUpdateUser();
  const { updateProfile, loading: updatingProfile, error: profileError, fieldErrors: profileFieldErrors } = useUpdateProfile();
  const { uploadCV, loading: uploadingCV } = useUploadCV();
  const { updateCV, loading: updatingCV }  = useUpdateCV();
  const { deleteCV, loading: deletingCV }  = useDeleteCV();

  const cvBusy = uploadingCV || updatingCV || deletingCV;
  const isBusy = updating || updatingProfile;

  // ── Combined flat form state ───────────────────────────────────────────
  const [form, setForm] = useState({
    // account
    name:      "",
    email:     "",
    password:  "",
    role:      "account_manager",
    is_active: true,
    // profile
    profile_picture:  "",
    title:            "",
    bio:              "",
    years_experience: "",
    certifications:   "",
    linkedin_url:     "",
    primary_email:    "",
    secondary_email:  "",
    phone:            "",
    whatsapp:         "",
    address:          "",
    city:             "",
    country:          "",
    postal_code:      "",
  });

  const set = (key: string, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    if (!user) return;
    const p = user.profile;
    setForm({
      name:      user.name      ?? "",
      email:     user.email     ?? "",
      password:  "",
      role:      user.role      ?? "account_manager",
      is_active: user.is_active ?? true,
      profile_picture:  p?.profile_picture  ?? "",
      title:            p?.title            ?? "",
      bio:              p?.bio              ?? "",
      years_experience: p?.years_experience != null ? String(p.years_experience) : "",
      certifications:   p?.certifications   ?? "",
      linkedin_url:     p?.linkedin_url     ?? "",
      primary_email:    p?.primary_email    ?? "",
      secondary_email:  p?.secondary_email  ?? "",
      phone:            p?.phone            ?? "",
      whatsapp:         p?.whatsapp         ?? "",
      address:          p?.address          ?? "",
      city:             p?.city             ?? "",
      country:          p?.country          ?? "",
      postal_code:      p?.postal_code      ?? "",
    });
  }, [user]);

  // ── CV (immediate upload, not tied to submit) ─────────────────────────
  const [cvFile, setCvFile] = useState<File | null>(null);

  const handleCvChange = async (file: File) => {
    setCvFile(file);
    const result = user?.profile?.cv
      ? await updateCV(user.uid, file)
      : await uploadCV(user.uid, file);
    setCvFile(null);
    if (result) { addToast("CV updated", "success"); refetch(); }
  };

  const handleCvDelete = async () => {
    if (!user) return;
    const ok = await deleteCV(user.uid);
    if (ok) { addToast("CV removed", "success"); refetch(); }
  };

  // ── Submit ────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    const accountPayload: any = {
      name:      form.name,
      email:     form.email,
      role:      form.role,
      is_active: form.is_active,
    };
    if (form.password) accountPayload.password = form.password;

    const profilePayload: any = {
      profile_picture:  form.profile_picture  || undefined,
      title:            form.title            || undefined,
      bio:              form.bio              || undefined,
      years_experience: form.years_experience !== "" ? Number(form.years_experience) : null,
      certifications:   form.certifications   || undefined,
      linkedin_url:     form.linkedin_url     || undefined,
      primary_email:    form.primary_email    || undefined,
      secondary_email:  form.secondary_email  || undefined,
      phone:            form.phone            || undefined,
      whatsapp:         form.whatsapp         || undefined,
      address:          form.address          || undefined,
      city:             form.city             || undefined,
      country:          form.country          || undefined,
      postal_code:      form.postal_code      || undefined,
    };

    const [accountResult, profileResult] = await Promise.all([
      updateUser(id, accountPayload),
      updateProfile(id, profilePayload),
    ]);

    refetch();

    if (accountResult && profileResult) {
      addToast("User updated successfully", "success");
      navigate("/admin/users");
    }
  };

  // ── Loading / error states ─────────────────────────────────────────────
  if (loadingUser) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-slate-400">
        Loading user...
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
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

        {/* Card header */}
        <div className="px-4 sm:px-6 py-4 border-b border-slate-100">
          <h1 className="text-base font-bold text-navy-800">Edit User</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Updating <span className="font-semibold text-navy-700">{user?.name}</span>
          </p>
        </div>

        {/* ── Profile picture — top of form ──────────────────────────── */}
        <AvatarUpload
          value={form.profile_picture}
          name={form.name}
          onChange={(url) => set("profile_picture", url)}
        />

        {/* ── Form ────────────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-6 space-y-6">

          {/* General errors */}
          {(updateError || profileError) && (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600 space-y-0.5">
              {updateError  && <p>{updateError}</p>}
              {profileError && <p>{profileError}</p>}
            </div>
          )}

          {/* Account */}
          <div className="space-y-4">
            <SectionLabel>Account</SectionLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Full Name"
                field="name"
                placeholder="John Doe"
                formData={form}
                errors={fieldErrors}
                updateFormData={set}
              />
              <InputField
                label="Login Email"
                field="email"
                type="email"
                placeholder="john@example.com"
                formData={form}
                errors={fieldErrors}
                updateFormData={set}
              />
              <SelectField
                label="Role"
                field="role"
                options={ROLES}
                formData={form}
                errors={fieldErrors}
                updateFormData={set}
              />
              <InputField
                label="Password"
                field="password"
                type="password"
                placeholder="••••••••"
                required={false}
                hint="Leave blank to keep current"
                formData={form}
                errors={fieldErrors}
                updateFormData={set}
              />
            </div>
            <CompactToggle
              label="Active"
              description="Account can log in and access the system"
              field="is_active"
              formData={form}
              errors={fieldErrors}
              updateFormData={set}
            />
          </div>

          {/* Professional */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <SectionLabel>Professional</SectionLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Title"
                field="title"
                placeholder="e.g. Senior Trainer"
                formData={form}
                errors={profileFieldErrors}
                updateFormData={set}
                required={false}
              />
              <InputField
                label="Years of Experience"
                field="years_experience"
                type="number"
                placeholder="e.g. 5"
                formData={form}
                errors={profileFieldErrors}
                updateFormData={set}
                required={false}
              />
            </div>
            <TextareaField
              label="Bio"
              field="bio"
              placeholder="Brief professional bio..."
              rows={3}
              formData={form}
              errors={profileFieldErrors}
              updateFormData={set}
              required={false}
            />
            <TextareaField
              label="Certifications"
              field="certifications"
              placeholder="List relevant certifications..."
              rows={3}
              formData={form}
              errors={profileFieldErrors}
              updateFormData={set}
              required={false}
            />
            <InputField
              label="LinkedIn URL"
              field="linkedin_url"
              type="url"
              placeholder="https://linkedin.com/in/..."
              formData={form}
              errors={profileFieldErrors}
              updateFormData={set}
              required={false}
            />
          </div>

          {/* Contact */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <SectionLabel>Contact</SectionLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Contact Email (Primary)"
                field="primary_email"
                type="email"
                placeholder="primary@example.com"

                formData={form}
                errors={profileFieldErrors}
                updateFormData={set}
                required={false}
              />
              <InputField
                label="Contact Email (Secondary)"
                field="secondary_email"
                type="email"
                placeholder="secondary@example.com"

                formData={form}
                errors={profileFieldErrors}
                updateFormData={set}
                required={false}
              />
              <InputField
                label="Phone"
                field="phone"
                placeholder="+1 234 567 8900"

                formData={form}
                errors={profileFieldErrors}
                updateFormData={set}
                required={false}
              />
              <InputField
                label="WhatsApp"
                field="whatsapp"
                placeholder="+1 234 567 8900"

                formData={form}
                errors={profileFieldErrors}
                updateFormData={set}
                required={false}
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <SectionLabel>Address</SectionLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <InputField
                  label="Street Address"
                  field="address"
                  placeholder="Street address"

                  formData={form}
                  errors={profileFieldErrors}
                  updateFormData={set}
                  required={false}
                />
              </div>
              <InputField
                label="City"
                field="city"
                placeholder="City"
                formData={form}
                errors={profileFieldErrors}
                updateFormData={set}
                required={false}
              />
              <SearchableSelect
                label="Country"
                field="country"
                options={COUNTRIES.map((c) => ({ value: c.name, label: c.name }))}
                formData={form}
                errors={profileFieldErrors}
                updateFormData={set}
                placeholder="Select country..."
              />
              <InputField
                label="Postal Code"
                field="postal_code"
                placeholder="Postal code"
                formData={form}
                errors={profileFieldErrors}
                updateFormData={set}
                required={false}
              />
            </div>
          </div>

          {/* Documents */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <SectionLabel>Documents</SectionLabel>
            <FileUploadField
              accept=".pdf,.doc,.docx"
              simpleFile={cvFile}
              onSimpleFileChange={handleCvChange}
              onSimpleRemove={() => setCvFile(null)}
              simpleUploading={cvBusy}
              existingFileUrl={user?.profile?.cv || null}
              existingFileName="Current CV"
              onExistingRemove={handleCvDelete}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 border-t border-slate-100 pt-5">
            <Button
              type="button"
              text="Cancel"
              onClick={() => navigate("/admin/users")}
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
              text={isBusy ? "Saving..." : "Save Changes"}
              disabled={isBusy || !form.name.trim()}
              className="flex-1 py-2.5"
            />
          </div>

        </form>
      </div>
    </div>
  );
};

export default UserEditPage;
