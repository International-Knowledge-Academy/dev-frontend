// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCreateUser from "hooks/users/useCreateUser";
import { useToast } from "context/ToastContext";
import InputField from "components/form/InputField";
import ToggleInput from "components/form/toggle/ToggleInput";
import Button from "components/ui/buttons/Button";

const TrainerCreatePage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { createUser, loading, error, fieldErrors } = useCreateUser();

  const [form, setForm] = useState({
    name:      "",
    email:     "",
    is_active: true,
  });

  const updateFormData = (key: string, value: any) =>
    setForm((p) => ({ ...p, [key]: value }));

  const isFormValid =
    form.name.trim() !== "" &&
    form.email.trim() !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tempPassword = crypto.randomUUID().replace(/-/g, "") + "Aa1!";
    const created = await createUser({ ...form, role: "trainer", password: tempPassword });
    if (!created) return;
    addToast("Trainer created successfully", "success");
    navigate("/admin/trainers");
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="px-4 sm:px-6 py-4 border-b border-slate-100">
          <h1 className="text-base font-bold text-navy-800">Create Trainer</h1>
          <p className="text-xs text-slate-400 mt-0.5">Fill in the details to add a new trainer account</p>
        </div>

        <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-5 grid grid-cols-1 gap-4">
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
          </div>

          <ToggleInput
            label="Active"
            field="is_active"
            formData={form}
            errors={fieldErrors}
            updateFormData={updateFormData}
          />

          {/* Actions */}
          <div className="flex gap-2 border-t border-slate-100 pt-5">
            <Button
              type="button"
              text="Cancel"
              onClick={() => navigate("/admin/trainers")}
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
              text={loading ? "Creating..." : "Create Trainer"}
              disabled={loading || !isFormValid}
              className="flex-1 py-2.5"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrainerCreatePage;
