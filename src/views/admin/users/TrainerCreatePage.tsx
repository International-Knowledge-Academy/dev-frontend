// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCreateUser from "hooks/users/useCreateUser";
import useUploadProfilePicture from "hooks/users/profile/useUploadProfilePicture";
import { useToast } from "context/ToastContext";
import InputField from "components/form/InputField";
import ToggleInput from "components/form/toggle/ToggleInput";
import PasswordField from "components/form/PasswordField";
import Button from "components/ui/buttons/Button";
import ImageUploadField from "components/form/images/ImageUploadField";

const TrainerCreatePage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { createUser, loading, error, fieldErrors }          = useCreateUser();
  const { uploadProfilePicture, loading: uploadingPic }      = useUploadProfilePicture();

  const [picFile, setPicFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    name:      "",
    email:     "",
    password:  "",
    is_active: true,
  });

  const updateFormData = (key: string, value: any) =>
    setForm((p) => ({ ...p, [key]: value }));

  const isFormValid =
    form.name.trim() !== "" &&
    form.email.trim() !== "" &&
    form.password.trim() !== "";

  const isBusy = loading || uploadingPic;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const created = await createUser({ ...form, role: "trainer" });
    if (!created) return;
    if (picFile) await uploadProfilePicture(created.uid, picFile);
    addToast("Trainer created successfully", "success");
    navigate("/admin/users");
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h1 className="text-base font-bold text-navy-800">Create Trainer</h1>
          <p className="text-xs text-gray-400 mt-0.5">Fill in the details to add a new trainer account</p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 grid grid-cols-1 gap-4">
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Profile picture */}
          <div className="pb-4 border-b border-gray-100">
            <p className="text-xs font-semibold text-navy-600 mb-3">
              Profile Picture <span className="font-normal text-gray-400">(optional)</span>
            </p>
            <ImageUploadField
              imageOnly
              simpleFile={picFile}
              onSimpleFileChange={setPicFile}
              onSimpleRemove={() => setPicFile(null)}
              simpleUploading={uploadingPic}
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
            <PasswordField
              placeholder="Min. 8 characters"
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

          {/* Actions */}
          <div className="flex gap-2 border-t border-gray-100 pt-4">
            <Button
              type="button"
              text="Cancel"
              onClick={() => navigate("/admin/users")}
              className="flex-1 py-2.5"
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
              text={uploadingPic ? "Uploading picture..." : loading ? "Creating..." : "Create Trainer"}
              disabled={isBusy || !isFormValid}
              className="flex-1 py-2.5"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrainerCreatePage;
