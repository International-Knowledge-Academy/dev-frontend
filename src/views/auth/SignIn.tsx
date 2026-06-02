// @ts-nocheck
import { useState } from "react";
import { motion } from "framer-motion";
import InputField from "components/form/InputField";
import PasswordField from "components/form/PasswordField";
import Checkbox from "components/checkbox";
import useLogin from "hooks/auth/useLogin";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut", delay },
});

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
    <div className="flex min-h-screen w-full items-center justify-center px-5 md:mx-0 md:px-0 md:items-center md:justify-start">
      <div className="w-full max-w-[420px] md:pl-4 lg:pl-0">

        {/* Mobile logo */}
        <motion.div {...fadeUp(0)} className="flex flex-col items-center mb-8 md:hidden">
          <img src="/brand/IKA Logo-02.png" alt="IKA" className="w-16 h-16 object-contain mb-3" />
          <h2 className="text-lg font-black text-navy-800">International Knowledge Academy</h2>
        </motion.div>

        <motion.h4 {...fadeUp(0)} className="mb-2 text-3xl font-bold text-navy-800">
          Sign In
        </motion.h4>
        <motion.p {...fadeUp(0.08)} className="mb-8 text-sm text-slate-500">
          Enter your email and password to sign in.
        </motion.p>

        <motion.form {...fadeUp(0.16)} onSubmit={handleSubmit}>
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

          <div className="mb-5 flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Checkbox />
              <p className="text-sm font-medium text-navy-700">Keep me logged in</p>
            </div>
            <a className="text-sm font-medium text-navy-500 hover:text-navy-700 transition-colors" href=" ">
              Forgot Password?
            </a>
          </div>

          {(errors.general || error) && (
            <p className="mb-3 text-sm text-red-500">{errors.general ?? error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-md lg:rounded-lg bg-navy-800 py-3 text-base font-semibold text-white transition duration-200 hover:bg-navy-900 active:bg-navy-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </motion.form>
      </div>
    </div>
  );
}
