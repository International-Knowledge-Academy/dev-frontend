// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCreateUser from "hooks/users/useCreateUser";
import { useToast } from "context/ToastContext";
import InputField from "components/form/InputField";
import SelectField from "components/form/SelectField";
import CompactToggle from "components/form/toggle/CompactToggle";
import PasswordField from "components/form/PasswordField";
import Button from "components/ui/buttons/Button";

const ROLES = [
  { value: "admin",           label: "Admin" },
  { value: "account_manager", label: "Account Manager" },
];

const UserCreatePage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { createUser, loading, error, fieldErrors } = useCreateUser();

  const [form, setForm] = useState({
    name:      "",
    email:     "",
    password:  "",
    role:      "account_manager",
    is_active: true,
  });

  const updateFormData = (key: string, value: any) =>
    setForm((p) => ({ ...p, [key]: value }));

  const isFormValid =
    form.name.trim() !== "" &&
    form.email.trim() !== "" &&
    form.password.trim() !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { user: created, fieldErrors: fe, error: ge } = await createUser({ ...form });
    if (created) {
      addToast("User created successfully", "success");
      navigate("/admin/users");
    } else {
      const firstFieldError = Object.values(fe)[0];
      addToast(firstFieldError ?? ge ?? "Failed to create user. Please try again.", "error");
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="px-4 sm:px-6 py-4 border-b border-slate-100">
          <h1 className="text-base font-bold text-navy-800">Create Staff Account</h1>
          <p className="text-xs text-slate-400 mt-0.5">Add a new admin or account manager</p>
        </div>

        <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-5 grid grid-cols-1 gap-4">
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
              {error}
            </div>
          )}

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
            <PasswordField
              placeholder="Min. 8 characters"
              formData={form}
              errors={fieldErrors}
              updateFormData={updateFormData}
            />
          </div>

          <CompactToggle
            label="Active"
            description="Account can log in and access the system"
            field="is_active"
            formData={form}
            errors={fieldErrors}
            updateFormData={updateFormData}
          />

          <div className="flex flex-col-reverse sm:flex-row gap-2 border-t border-slate-100 pt-5">
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
              text={loading ? "Creating..." : "Create User"}
              disabled={loading || !isFormValid}
              className="flex-1 py-2.5"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserCreatePage;
