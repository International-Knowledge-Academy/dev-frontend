// @ts-nocheck
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useGetUser from "hooks/users/useGetUser";
import useUpdateUser from "hooks/users/useUpdateUser";
import useUpdateProfile from "hooks/users/useUpdateProfile";
import useUploadCV from "hooks/users/profile/useUploadCV";
import useUpdateCV from "hooks/users/profile/useUpdateCV";
import useDeleteCV from "hooks/users/profile/useDeleteCV";
import { useToast } from "context/ToastContext";
import InputField from "components/form/InputField";
import TextareaField from "components/form/TextareaField";
import SelectField from "components/form/SelectField";
import ToggleInput from "components/form/toggle/ToggleInput";
import Button from "components/ui/buttons/Button";
import MediaUploadField from "components/form/filesUpload/MediaUploadField";
import FileUploadField from "components/form/filesUpload/FileUploadField";

const ROLES = [
  { value: "admin",           label: "Admin" },
  { value: "account_manager", label: "Account Manager" },
  { value: "trainer",         label: "Trainer" },
];

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 mt-1">{children}</p>
);

const UserEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const { user, loading: loadingUser, error: loadError, refetch } = useGetUser(id);
  const { updateUser, loading: updating, error: updateError, fieldErrors }     = useUpdateUser();
  const { updateProfile, loading: updatingProfile, error: profileError, fieldErrors: profileFieldErrors } = useUpdateProfile();
  const { uploadCV, loading: uploadingCV }   = useUploadCV();
  const { updateCV, loading: updatingCV }    = useUpdateCV();
  const { deleteCV, loading: deletingCV }    = useDeleteCV();

  const cvBusy = uploadingCV || updatingCV || deletingCV;

  // ── Account form ─────────────────────────────────────────────────────────
  const [accountForm, setAccountForm] = useState({
    name:      "",
    email:     "",
    password:  "",
    role:      "account_manager",
    is_active: true,
  });

  // ── Profile form ─────────────────────────────────────────────────────────
  const [profileForm, setProfileForm] = useState({
    profile_picture: "",
    title:           "",
    bio:             "",
    years_experience: "",
    certifications:  "",
    linkedin_url:    "",
    primary_email:   "",
    secondary_email: "",
    phone:           "",
    whatsapp:        "",
    address:         "",
    country:         "",
    city:            "",
    postal_code:     "",
  });

  useEffect(() => {
    if (!user) return;
    setAccountForm({
      name:      user.name      ?? "",
      email:     user.email     ?? "",
      password:  "",
      role:      user.role      ?? "account_manager",
      is_active: user.is_active ?? true,
    });
    const p = user.profile;
    if (p) {
      setProfileForm({
        profile_picture: p.profile_picture ?? "",
        title:           p.title           ?? "",
        bio:             p.bio             ?? "",
        years_experience: p.years_experience != null ? String(p.years_experience) : "",
        certifications:  p.certifications  ?? "",
        linkedin_url:    p.linkedin_url    ?? "",
        primary_email:   p.primary_email   ?? "",
        secondary_email: p.secondary_email ?? "",
        phone:           p.phone           ?? "",
        whatsapp:        p.whatsapp        ?? "",
        address:         p.address         ?? "",
        country:         p.country         ?? "",
        city:            p.city            ?? "",
        postal_code:     p.postal_code     ?? "",
      });
    }
  }, [user]);

  const setAccount = (key: string, value: any) =>
    setAccountForm((p) => ({ ...p, [key]: value }));

  const setProfile = (key: string, value: any) =>
    setProfileForm((p) => ({ ...p, [key]: value }));

  // ── CV handlers ───────────────────────────────────────────────────────────
  const [cvFile, setCvFile] = useState<File | null>(null);

  const handleCvFileChange = async (file: File) => {
    setCvFile(file);
    const result = user?.profile?.cv
      ? await updateCV(user.uid, file)
      : await uploadCV(user.uid, file);
    setCvFile(null);
    if (result) { addToast("CV updated successfully", "success"); refetch(); }
  };

  const handleCvDelete = async () => {
    if (!user) return;
    const ok = await deleteCV(user.uid);
    if (ok) { addToast("CV removed", "success"); refetch(); }
  };

  // ── Submit: account ───────────────────────────────────────────────────────
  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    const payload: any = {
      name:      accountForm.name,
      email:     accountForm.email,
      role:      accountForm.role,
      is_active: accountForm.is_active,
    };
    if (accountForm.password) payload.password = accountForm.password;
    const updated = await updateUser(id, payload);
    if (updated) {
      addToast("Account updated successfully", "success");
      refetch();
    }
  };

  // ── Submit: profile ───────────────────────────────────────────────────────
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const payload: any = {
      profile_picture: profileForm.profile_picture || undefined,
      title:           profileForm.title           || undefined,
      bio:             profileForm.bio             || undefined,
      years_experience: profileForm.years_experience !== ""
        ? Number(profileForm.years_experience)
        : null,
      certifications:  profileForm.certifications  || undefined,
      linkedin_url:    profileForm.linkedin_url    || undefined,
      primary_email:   profileForm.primary_email   || undefined,
      secondary_email: profileForm.secondary_email || undefined,
      phone:           profileForm.phone           || undefined,
      whatsapp:        profileForm.whatsapp        || undefined,
      address:         profileForm.address         || undefined,
      country:         profileForm.country         || undefined,
      city:            profileForm.city            || undefined,
      postal_code:     profileForm.postal_code     || undefined,
    };
    const updated = await updateProfile(id, payload);
    if (updated) {
      addToast("Profile updated successfully", "success");
      refetch();
    }
  };

  if (loadingUser) {
    return <div className="flex items-center justify-center py-20 text-sm text-slate-400">Loading user...</div>;
  }

  if (loadError) {
    return <div className="flex items-center justify-center py-20 text-sm text-red-500">{loadError}</div>;
  }

  return (
    <div className="space-y-4">

      {/* ── Account section ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="px-4 sm:px-6 py-4 border-b border-slate-100">
          <h1 className="text-base font-bold text-navy-800">Account</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Login credentials and role for{" "}
            <span className="font-semibold text-navy-700">{user?.name}</span>
          </p>
        </div>

        <form onSubmit={handleAccountSubmit} className="px-4 sm:px-6 py-5 space-y-4">
          {updateError && (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
              {updateError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Full Name"
              field="name"
              placeholder="John Doe"
              formData={accountForm}
              errors={fieldErrors}
              updateFormData={setAccount}
            />
            <InputField
              label="Email"
              field="email"
              type="email"
              placeholder="john@example.com"
              formData={accountForm}
              errors={fieldErrors}
              updateFormData={setAccount}
            />
            <SelectField
              label="Role"
              field="role"
              options={ROLES}
              formData={accountForm}
              errors={fieldErrors}
              updateFormData={setAccount}
            />
            <InputField
              label="Password"
              field="password"
              type="password"
              placeholder="••••••••"
              required={false}
              hint="leave blank to keep current"
              formData={accountForm}
              errors={fieldErrors}
              updateFormData={setAccount}
            />
          </div>

          <ToggleInput
            label="Active"
            field="is_active"
            formData={accountForm}
            errors={fieldErrors}
            updateFormData={setAccount}
          />

          <div className="flex gap-2 pt-2 border-t border-slate-100">
            <Button
              type="button"
              text="Cancel"
              onClick={() => navigate("/admin/users")}
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
              text={updating ? "Saving..." : "Save Account"}
              disabled={updating}
            />
          </div>
        </form>
      </div>

      {/* ── Profile section ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="px-4 sm:px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-navy-800">Profile</h2>
          <p className="text-xs text-slate-400 mt-0.5">Personal details, contact info, and documents</p>
        </div>

        <form onSubmit={handleProfileSubmit} className="px-4 sm:px-6 py-5 space-y-6">
          {profileError && (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
              {profileError}
            </div>
          )}

          {/* Profile picture */}
          <div>
            <SectionLabel>Profile Picture</SectionLabel>
            <MediaUploadField
              label="Profile Picture"
              type="image"
              folder="users/profiles"
              value={profileForm.profile_picture}
              onChange={(url) => setProfile("profile_picture", url)}
              error={profileFieldErrors.profile_picture}
            />
          </div>

          {/* Professional */}
          <div>
            <SectionLabel>Professional</SectionLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Title"
                field="title"
                placeholder="e.g. Senior Trainer"
                formData={profileForm}
                errors={profileFieldErrors}
                updateFormData={setProfile}
                required={false}
              />
              <InputField
                label="Years of Experience"
                field="years_experience"
                type="number"
                placeholder="e.g. 5"
                formData={profileForm}
                errors={profileFieldErrors}
                updateFormData={setProfile}
                required={false}
              />
            </div>
            <div className="mt-4 space-y-4">
              <TextareaField
                label="Bio"
                field="bio"
                placeholder="Brief professional bio..."
                rows={3}
                formData={profileForm}
                errors={profileFieldErrors}
                updateFormData={setProfile}
                required={false}
              />
              <TextareaField
                label="Certifications"
                field="certifications"
                placeholder="List certifications..."
                rows={3}
                formData={profileForm}
                errors={profileFieldErrors}
                updateFormData={setProfile}
                required={false}
              />
              <InputField
                label="LinkedIn URL"
                field="linkedin_url"
                type="url"
                placeholder="https://linkedin.com/in/..."
                formData={profileForm}
                errors={profileFieldErrors}
                updateFormData={setProfile}
                required={false}
              />
            </div>
          </div>

          {/* Contact */}
          <div>
            <SectionLabel>Contact</SectionLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Primary Email"
                field="primary_email"
                type="email"
                placeholder="primary@example.com"
                formData={profileForm}
                errors={profileFieldErrors}
                updateFormData={setProfile}
                required={false}
              />
              <InputField
                label="Secondary Email"
                field="secondary_email"
                type="email"
                placeholder="secondary@example.com"
                formData={profileForm}
                errors={profileFieldErrors}
                updateFormData={setProfile}
                required={false}
              />
              <InputField
                label="Phone"
                field="phone"
                placeholder="+1 234 567 8900"
                formData={profileForm}
                errors={profileFieldErrors}
                updateFormData={setProfile}
                required={false}
              />
              <InputField
                label="WhatsApp"
                field="whatsapp"
                placeholder="+1 234 567 8900"
                formData={profileForm}
                errors={profileFieldErrors}
                updateFormData={setProfile}
                required={false}
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <SectionLabel>Address</SectionLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <InputField
                  label="Address"
                  field="address"
                  placeholder="Street address"
                  formData={profileForm}
                  errors={profileFieldErrors}
                  updateFormData={setProfile}
                  required={false}
                />
              </div>
              <InputField
                label="City"
                field="city"
                placeholder="City"
                formData={profileForm}
                errors={profileFieldErrors}
                updateFormData={setProfile}
                required={false}
              />
              <InputField
                label="Country"
                field="country"
                placeholder="Country"
                formData={profileForm}
                errors={profileFieldErrors}
                updateFormData={setProfile}
                required={false}
              />
              <InputField
                label="Postal Code"
                field="postal_code"
                placeholder="Postal code"
                formData={profileForm}
                errors={profileFieldErrors}
                updateFormData={setProfile}
                required={false}
              />
            </div>
          </div>

          {/* CV */}
          <div>
            <SectionLabel>CV / Resume</SectionLabel>
            <FileUploadField
              accept=".pdf,.doc,.docx"
              simpleFile={cvFile}
              onSimpleFileChange={handleCvFileChange}
              onSimpleRemove={() => setCvFile(null)}
              simpleUploading={cvBusy}
              existingFileUrl={user?.profile?.cv || null}
              existingFileName="Current CV"
              onExistingRemove={handleCvDelete}
            />
          </div>

          <div className="flex gap-2 pt-2 border-t border-slate-100">
            <Button
              type="button"
              text="Cancel"
              onClick={() => navigate("/admin/users")}
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
              text={updatingProfile ? "Saving..." : "Save Profile"}
              disabled={updatingProfile}
            />
          </div>
        </form>
      </div>

    </div>
  );
};

export default UserEditPage;
