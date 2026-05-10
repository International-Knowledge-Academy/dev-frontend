// @ts-nocheck
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Camera } from "lucide-react";
import useGetUser from "hooks/users/useGetUser";
import useUpdateUser from "hooks/users/useUpdateUser";
import useUpdateProfile from "hooks/users/useUpdateProfile";
import useDeleteProfilePicture from "hooks/users/profile/useDeleteProfilePicture";
import usePresignedUpload from "hooks/storage/usePresignedUpload";
import { useToast } from "context/ToastContext";
import InputField from "components/form/InputField";
import PasswordField from "components/form/PasswordField";
import ToggleInput from "components/form/toggle/ToggleInput";
import Button from "components/ui/buttons/Button";
import FileUploadField from "components/form/filesUpload/FileUploadField";
import Loading from "components/loading/Loading";
import type { PresignedUploadResult } from "hooks/storage/usePresignedUpload";

// ── Avatar upload widget ───────────────────────────────────────────────────
const AvatarUpload = ({
  displayUrl,
  name,
  onChange,
}: {
  displayUrl: string;
  name: string;
  onChange: (result: PresignedUploadResult) => void;
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
    const result = await upload(file, { folder: "images/profiles", file_type: "image" });
    if (result) { onChange(result); reset(); }
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
            <div
              className="h-full rounded-full bg-gold-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 text-center">Uploading {progress}%</p>
        </div>
      )}

      {!uploading && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-xs text-navy-600 hover:text-navy-800 transition font-medium"
        >
          {displayUrl ? "Change photo" : "Upload photo"}
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

const TrainerEditPage = () => {
  const { uid } = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const { user, loading: loadingUser, error: loadError, refetch } = useGetUser(uid);
  const { updateUser, loading: updating, error, fieldErrors, getLastError } = useUpdateUser();
  const { updateProfile }                               = useUpdateProfile();
  const { deleteProfilePicture, loading: deletingPic }  = useDeleteProfilePicture();
  const { upload: uploadCvFile, uploading: uploadingCvFile } = usePresignedUpload();

  const [cvFile,            setCvFile]            = useState<File | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState("");

  const cvBusy = uploadingCvFile;

  const handleCvFileChange = async (file: File) => {
    setCvFile(file);
    const uploaded = await uploadCvFile(file, { folder: "documents/cvs", file_type: "pdf" });
    setCvFile(null);
    if (uploaded) {
      const result = await updateProfile(uid, { cv: uploaded.file_key });
      if (result) { addToast("CV updated successfully", "success"); refetch(); }
      else { addToast("Failed to update CV. Please try again.", "error"); }
    } else {
      addToast("Failed to upload CV. Please try again.", "error");
    }
  };

  const handleCvDelete = async () => {
    const result = await updateProfile(uid, { cv: null });
    if (result) { addToast("CV removed", "success"); refetch(); }
    else { addToast("Failed to remove CV. Please try again.", "error"); }
  };

  const handlePicChange = async ({ file_key, public_url }: PresignedUploadResult) => {
    setProfilePictureUrl(public_url);
    const result = await updateProfile(uid, { profile_picture: file_key });
    if (result) { addToast("Profile picture updated", "success"); refetch(); }
  };

  const handlePicDelete = async () => {
    if (!user) return;
    const ok = await deleteProfilePicture(user.uid);
    if (ok) { setProfilePictureUrl(""); addToast("Profile picture removed", "success"); refetch(); }
  };

  const [form, setForm] = useState({
    name:      "",
    email:     "",
    password:  "",
    is_active: true,
  });

  useEffect(() => {
    if (user) {
      setForm({
        name:      user.name      ?? "",
        email:     user.email     ?? "",
        password:  "",
        is_active: user.is_active ?? true,
      });
      setProfilePictureUrl(user.profile?.profile_picture?.public_url ?? "");
    }
  }, [user]);

  const updateFormData = (key: string, value: any) =>
    setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload: any = {
      name:      form.name,
      email:     form.email,
      role:      "trainer",
      is_active: form.is_active,
    };
    if (form.password) payload.password = form.password;
    const updated = await updateUser(uid, payload);
    if (updated) {
      addToast("Trainer updated successfully", "success");
      navigate("/account-manager/trainers");
    } else {
      const { fieldErrors: fe, error: ge } = getLastError();
      addToast(Object.values(fe)[0] ?? ge ?? "Failed to update trainer. Please try again.", "error");
    }
  };

  if (loadingUser) return <Loading text="Loading trainer..." />;

  if (loadError) {
    return <div className="flex items-center justify-center py-20 text-sm text-red-500">{loadError}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-slate-100">
          <h1 className="text-base font-bold text-navy-800">Edit Trainer</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Update the details for <span className="font-semibold text-navy-700">{user?.name}</span>
          </p>
        </div>

        {/* Avatar */}
        <AvatarUpload
          displayUrl={profilePictureUrl}
          name={form.name}
          onChange={handlePicChange}
        />

        {profilePictureUrl && (
          <div className="flex justify-center pb-2">
            <button
              type="button"
              onClick={handlePicDelete}
              disabled={deletingPic}
              className="text-xs text-red-500 hover:text-red-700 transition"
            >
              {deletingPic ? "Removing..." : "Remove photo"}
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-5 space-y-5">
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Account fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Full Name"
              field="name"
              placeholder="Jane Smith"
              formData={form}
              errors={fieldErrors}
              updateFormData={updateFormData}
            />
            <InputField
              label="Email"
              field="email"
              type="email"
              placeholder="jane@example.com"
              formData={form}
              errors={fieldErrors}
              updateFormData={updateFormData}
            />
            <PasswordField
              label="Password"
              required={false}
              placeholder="••••••••"
              hint="Leave blank to keep current"
              formData={form}
              errors={fieldErrors}
              updateFormData={updateFormData}
            />
          </div>

          <ToggleInput
            label="Active"
            field="is_active"
            formData={form}
            errors={fieldErrors}
            updateFormData={updateFormData}
          />

          {/* CV */}
          <div className="border-t border-slate-100 pt-4">
            <p className="text-xs font-semibold text-navy-600 mb-3">CV / Resume</p>
            <FileUploadField
              accept=".pdf,.doc,.docx"
              simpleFile={cvFile}
              onSimpleFileChange={handleCvFileChange}
              onSimpleRemove={() => setCvFile(null)}
              simpleUploading={cvBusy}
              existingFileUrl={user?.profile?.cv?.public_url || null}
              existingFileName="Current CV"
              onExistingRemove={handleCvDelete}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 border-t border-slate-100 pt-5">
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
