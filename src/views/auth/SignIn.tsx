// @ts-nocheck
import { useState } from "react";
import InputField from "components/form/InputField";
import PasswordField from "components/form/PasswordField";
import Checkbox from "components/checkbox";
import useLogin from "hooks/auth/useLogin";

export default function SignIn() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const { login, loading, error } = useLogin();

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (Object.keys(newErrors).length) return setErrors(newErrors);

    await login({ email: formData.email, password: formData.password });
  };

  return (
    <div className="mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Sign In
        </h4>
        <p className="mb-9 ml-1 text-base text-gray-600">
          Enter your email and password to sign in!
        </p>

        <form onSubmit={handleSubmit}>
          <InputField
            label="Email"
            field="email"
            type="email"
            placeholder="mail@example.com"
            formData={formData}
            errors={errors}
            updateFormData={updateFormData}
          />

          <PasswordField
            placeholder="Min. 8 characters"
            formData={formData}
            errors={errors}
            updateFormData={updateFormData}
          />

          <div className="mb-4 flex items-center justify-between px-2">
            <div className="flex items-center">
              <Checkbox />
              <p className="ml-2 text-sm font-medium text-navy-700 dark:text-white">
                Keep me logged In
              </p>
            </div>
            <a
              className="text-sm font-medium text-navy-500 hover:text-navy-600 dark:text-white"
              href=" "
            >
              Forgot Password?
            </a>
          </div>

          {(errors.general || error) && (
            <p className="mb-3 text-sm text-red-500">{errors.general ?? error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="linear mt-2 w-full rounded-xl bg-navy-800 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-navy-900 active:bg-navy-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
