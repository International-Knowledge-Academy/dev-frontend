// @ts-nocheck
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import useGetUser from "hooks/users/useGetUser";
import useUpdateUser from "hooks/users/useUpdateUser";
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

  const { user, loading: loadingUser, error: loadError } = useGetUser(id);
  const { updateUser, loading: updating, error, fieldErrors } = useUpdateUser();

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
    <div className="">
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
