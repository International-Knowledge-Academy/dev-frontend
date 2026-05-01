// @ts-nocheck
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useGetUser from "hooks/users/useGetUser";
import useUpdateUser from "hooks/users/useUpdateUser";
import useUploadCV from "hooks/users/profile/useUploadCV";
import useUpdateCV from "hooks/users/profile/useUpdateCV";
import useDeleteCV from "hooks/users/profile/useDeleteCV";
import useUploadProfilePicture from "hooks/users/profile/useUploadProfilePicture";
import useUpdateProfilePicture from "hooks/users/profile/useUpdateProfilePicture";
import useDeleteProfilePicture from "hooks/users/profile/useDeleteProfilePicture";
import { useToast } from "context/ToastContext";
import InputField from "components/form/InputField";
import ToggleInput from "components/form/toggle/ToggleInput";
import Button from "components/ui/buttons/Button";
import ImageUploadField from "components/form/images/ImageUploadField";
import FileUploadField from "components/form/filesUpload/FileUploadField";

const TrainerEditPage = () => {
  const { uid } = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const { user, loading: loadingUser, error: loadError, refetch } = useGetUser(uid);
  const { updateUser, loading: updating, error, fieldErrors }     = useUpdateUser();
  const { uploadCV, loading: uploadingCV }              = useUploadCV();
  const { updateCV, loading: updatingCV }               = useUpdateCV();
  const { deleteCV, loading: deletingCV }               = useDeleteCV();
  const { uploadProfilePicture, loading: uploadingPic } = useUploadProfilePicture();
  const { updateProfilePicture, loading: updatingPic }  = useUpdateProfilePicture();
  const { deleteProfilePicture, loading: deletingPic }  = useDeleteProfilePicture();

  const [picFile, setPicFile] = useState<File | null>(null);
  const [cvFile,  setCvFile]  = useState<File | null>(null);

  const picBusy = uploadingPic || updatingPic || deletingPic;
  const cvBusy  = uploadingCV  || updatingCV  || deletingCV;

  const handlePicFileChange = async (file: File) => {
    setPicFile(file);
    const result = user?.profile?.profile_picture
      ? await updateProfilePicture(user.uid, file)
      : await uploadProfilePicture(user.uid, file);
    setPicFile(null);
    if (result) { addToast("Profile picture updated", "success"); refetch(); }
  };

  const handlePicDelete = async () => {
    if (!user) return;
    const ok = await deleteProfilePicture(user.uid);
    if (ok) { addToast("Profile picture removed", "success"); refetch(); }
  };

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

  const [form, setForm] = useState({
    name:      "",
    email:     "",
    password:  "",
    is_active: true,
  });

  useEffect(() => {
    if (user) {
      setForm({
        name:      user.name,
        email:     user.email,
        password:  "",
        is_active: user.is_active,
      });
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
      navigate("/admin/trainers");
    }
  };

  if (loadingUser) {
    return <div className="flex items-center justify-center py-20 text-sm text-gray-400">Loading trainer...</div>;
  }

  if (loadError) {
    return <div className="flex items-center justify-center py-20 text-sm text-red-500">{loadError}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100">
          <h1 className="text-base font-bold text-navy-800">Edit Trainer</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Update the details for <span className="font-semibold text-navy-700">{user?.name}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 grid grid-cols-1 gap-4">
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Profile Picture */}
          <div className="pb-4 border-b border-slate-100">
            <p className="text-xs font-semibold text-navy-600 mb-3">Profile Picture</p>
            <ImageUploadField
              imageOnly
              simpleFile={picFile}
              onSimpleFileChange={handlePicFileChange}
              onSimpleRemove={() => setPicFile(null)}
              simpleUploading={picBusy}
              existingUrl={user?.profile?.profile_picture || null}
              onExistingRemove={handlePicDelete}
            />
          </div>

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
            <InputField
              label="Password"
              field="password"
              type="password"
              placeholder="••••••••"
              required={false}
              hint="leave blank to keep current"
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
              existingFileUrl={user?.profile?.cv || null}
              existingFileName="Current CV"
              onExistingRemove={handleCvDelete}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 border-t border-slate-100 pt-4">
            <Button
              type="button"
              text="Cancel"
              onClick={() => navigate("/admin/trainers")}
              className="flex-1 py-2.5"
              bgColor="bg-white"
              textColor="text-gray-600"
              borderColor="border-slate-200"
              hoverBgColor="hover:bg-gray-50"
              hoverTextColor=""
              hoverBorderColor=""
            />
            <Button
              type="submit"
              variant="primary"
              text={updating ? "Saving..." : "Save Changes"}
              disabled={updating}
              className="flex-1 py-2.5"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrainerEditPage;
