// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import useCreateUser from "hooks/users/useCreateUser";
import { useToast } from "context/ToastContext";

import InputField from "components/form/InputField";
import SelectField from "components/form/SelectField";
import ToggleInput from "components/form/toggle/ToggleInput";
import PasswordField from "components/form/PasswordField"
import Button from "components/ui/buttons/Button"

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
    const created = await createUser({ ...form });
    if (created) {
      addToast("User created successfully", "success");
      navigate("/admin/users");
    }
  };

  return (
    <div className="">
      <div className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-100 dark:border-navy-700 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-navy-700">
          <h1 className="text-base font-bold text-navy-800 dark:text-white">Create User</h1>
          <p className="text-xs text-gray-400 mt-0.5">Fill in the details to add a new user</p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 grid grid-cols-1 gap-4">
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-600">
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

          {/* Actions */}
        
            <div className="flex gap-2 border-t border-gray-100 pt-5">
            
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
              text={loading ? "Creating..." : "Create User"}
              disabled={loading || !isFormValid}
              className="flex-1 rounded-xl py-2.5"
            />
          </div>

        </form>
      </div>
    </div>
  );
};

export default UserCreatePage;
