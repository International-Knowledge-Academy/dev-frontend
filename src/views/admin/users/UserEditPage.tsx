// @ts-nocheck
import { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdUpload, MdDescription, MdDelete, MdDownload, MdCamera } from "react-icons/md";
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
import SelectField from "components/form/SelectField";
import ToggleInput from "components/form/toggle/ToggleInput";
import Button from "components/ui/buttons/Button";

const ROLES = [
  { value: "admin",           label: "Admin" },
  { value: "account_manager", label: "Account Manager" },
];

const UserEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const { user, loading: loadingUser, error: loadError, refetch } = useGetUser(id);
  const { updateUser, loading: updating, error, fieldErrors }     = useUpdateUser();
  const { uploadCV, loading: uploading }                          = useUploadCV();
  const { updateCV, loading: replacingCV }                        = useUpdateCV();
  const { deleteCV, loading: deletingCV }                         = useDeleteCV();
  const { uploadProfilePicture, loading: uploadingPic }           = useUploadProfilePicture();
  const { updateProfilePicture, loading: updatingPic }            = useUpdateProfilePicture();
  const { deleteProfilePicture, loading: deletingPic }            = useDeleteProfilePicture();
  const fileInputRef    = useRef<HTMLInputElement>(null);
  const picInputRef     = useRef<HTMLInputElement>(null);

  const picBusy = uploadingPic || updatingPic || deletingPic;

  const handlePicChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const result = user.profile?.profile_picture
      ? await updateProfilePicture(user.uid, file)
      : await uploadProfilePicture(user.uid, file);
    if (result) { addToast("Profile picture updated", "success"); refetch(); }
    e.target.value = "";
  };

  const handlePicDelete = async () => {
    if (!user) return;
    const ok = await deleteProfilePicture(user.uid);
    if (ok) { addToast("Profile picture removed", "success"); refetch(); }
  };

  const cvBusy = uploading || replacingCV || deletingCV;

  const handleCVChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const result = user.profile?.cv
      ? await updateCV(user.uid, file)
      : await uploadCV(user.uid, file);
    if (result) { addToast("CV updated successfully", "success"); refetch(); }
    e.target.value = "";
  };

  const handleCVDelete = async () => {
    if (!user) return;
    const ok = await deleteCV(user.uid);
    if (ok) { addToast("CV removed", "success"); refetch(); }
  };

  const [form, setForm] = useState({
    name:      "",
    email:     "",
    password:  "",
    role:      "account_manager",
    is_active: true,
  });

  useEffect(() => {
    if (user) {
      setForm({
        name:      user.name,
        email:     user.email,
        password:  "",
        role:      user.role,
        is_active: user.is_active,
      });
    }
  }, [user]);

  const set = (key: string, value: any) =>
    setForm((p) => ({ ...p, [key]: value }));

  const updateFormData = (key: string, value: any) => set(key, value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload: any = {
      name:      form.name,
      email:     form.email,
      role:      form.role,
      is_active: form.is_active,
    };
    if (form.password) payload.password = form.password;

    const updated = await updateUser(id, payload);
    if (updated) {
      addToast("User updated successfully", "success");
      navigate("/admin/users");
    }
  };

  if (loadingUser) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-gray-400">
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
      <div className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-100 dark:border-navy-700 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-navy-700">
          <h1 className="text-base font-bold text-navy-800 dark:text-white">Edit User</h1>
          <p className="text-xs text-gray-400 mt-0.5">Update the details for <span className="font-semibold text-navy-700 dark:text-white">{user?.name}</span></p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 grid grid-cols-1 gap-4">
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Profile Picture */}
          <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-navy-700 flex items-center justify-center text-white font-bold text-xl overflow-hidden">
                {user?.profile?.profile_picture
                  ? <img src={user.profile.profile_picture} alt={user?.name} className="w-full h-full object-cover" />
                  : user?.name?.[0]?.toUpperCase() ?? "?"
                }
              </div>
              <button
                type="button"
                disabled={picBusy}
                onClick={() => picInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-navy-700 border-2 border-white flex items-center justify-center text-white hover:bg-navy-600 transition disabled:opacity-60"
              >
                <MdCamera size={12} />
              </button>
            </div>
            <div>
              <p className="text-sm font-medium text-navy-800 dark:text-white">Profile Picture</p>
              <div className="flex items-center gap-2 mt-1">
                <input ref={picInputRef} type="file" accept="image/*" className="hidden" onChange={handlePicChange} />
                <button type="button" disabled={picBusy} onClick={() => picInputRef.current?.click()}
                  className="text-xs text-navy-600 hover:text-navy-800 transition disabled:opacity-60">
                  {picBusy ? "Uploading..." : user?.profile?.profile_picture ? "Change" : "Upload"}
                </button>
                {user?.profile?.profile_picture && (
                  <>
                    <span className="text-gray-300">·</span>
                    <button type="button" disabled={picBusy} onClick={handlePicDelete}
                      className="text-xs text-red-400 hover:text-red-600 transition disabled:opacity-60">
                      Remove
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Full Name"
              field="name"
              placeholder="John Doe"
              formData={form}
              errors={fieldErrors}
              updateFormData={updateFormData}
            />
            <InputField
              label="Email"
              field="email"
              type="email"
              placeholder="john@example.com"
              formData={form}
              errors={fieldErrors}
              updateFormData={updateFormData}
            />
            <SelectField
              label="Role"
              field="role"
              options={ROLES}
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
          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs font-semibold text-navy-600 dark:text-navy-300 mb-2">Trainer CV</p>
            <div className="flex items-center gap-2 flex-wrap">
              {user?.profile?.cv && (
                <a href={user.profile.cv} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-navy-200 bg-navy-50 text-navy-700 text-sm hover:bg-navy-100 transition">
                  <MdDescription size={15} />
                  View CV
                  <MdDownload size={13} />
                </a>
              )}
              <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleCVChange} />
              <button type="button" disabled={cvBusy} onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition disabled:opacity-60">
                <MdUpload size={15} />
                {cvBusy ? "Uploading..." : user?.profile?.cv ? "Replace CV" : "Upload CV"}
              </button>
              {user?.profile?.cv && (
                <button type="button" disabled={cvBusy} onClick={handleCVDelete}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-red-500 text-sm hover:bg-red-50 transition disabled:opacity-60">
                  <MdDelete size={15} />
                  {deletingCV ? "Removing..." : "Remove CV"}
                </button>
              )}
              {!user?.profile?.cv && <span className="text-xs text-gray-400">No CV uploaded</span>}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 border-t border-gray-100 pt-4">
            <Button
              type="button"
              text="Cancel"
              onClick={() => navigate("/admin/users")}
              className="flex-1 rounded-xl py-2.5"
              bgColor="bg-white"
              textColor="text-gray-600"
              borderColor="border-gray-200"
              hoverBgColor="hover:bg-gray-50"
              hoverTextColor=""
              hoverBorderColor=""
            />
            <Button
              type="submit"
              variant="primary"
              text={updating ? "Saving..." : "Save Changes"}
              disabled={updating}
              className="flex-1 rounded-xl py-2.5"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEditPage;
