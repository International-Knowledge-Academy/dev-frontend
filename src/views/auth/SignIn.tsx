// @ts-nocheck
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import InputField from "components/form/InputField";
import PasswordField from "components/form/PasswordField";
import Checkbox from "components/checkbox";
import useLogin from "hooks/auth/useLogin";

const MAX_ATTEMPTS      = 5;
const LOCKOUT_MS        = 15 * 60 * 1000; // 15 minutes
const ATTEMPTS_KEY      = "ika_login_attempts";
const LOCKOUT_UNTIL_KEY = "ika_login_lockout_until";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut", delay },
});

const formatCountdown = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

export default function SignIn() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors]     = useState({});
  const { login, loading, error } = useLogin();

  /* ── Lockout state (persisted in localStorage) ─────────────────────────── */
  const [attempts, setAttempts] = useState<number>(() => {
    const stored = localStorage.getItem(ATTEMPTS_KEY);
    return stored ? parseInt(stored, 10) : 0;
  });

  const [lockoutUntil, setLockoutUntil] = useState<number | null>(() => {
    const stored = localStorage.getItem(LOCKOUT_UNTIL_KEY);
    if (!stored) return null;
    const ts = parseInt(stored, 10);
    return ts > Date.now() ? ts : null;
  });

  const [remaining, setRemaining] = useState<number>(0);

  /* ── Countdown ticker ───────────────────────────────────────────────────── */
  useEffect(() => {
    if (!lockoutUntil) return;
    const tick = () => {
      const left = lockoutUntil - Date.now();
      if (left <= 0) {
        setLockoutUntil(null);
        setAttempts(0);
        localStorage.removeItem(ATTEMPTS_KEY);
        localStorage.removeItem(LOCKOUT_UNTIL_KEY);
        setRemaining(0);
      } else {
        setRemaining(Math.ceil(left / 1000));
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [lockoutUntil]);

  const isLocked = !!lockoutUntil;

  /* ── Handlers ───────────────────────────────────────────────────────────── */
  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLocked || loading) return;

    const newErrors = {};
    if (!formData.email)    newErrors.email    = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (Object.keys(newErrors).length) return setErrors(newErrors);

    const success = await login({ email: formData.email, password: formData.password });

    if (success) {
      localStorage.removeItem(ATTEMPTS_KEY);
      localStorage.removeItem(LOCKOUT_UNTIL_KEY);
    } else {
      const next = attempts + 1;
      setAttempts(next);
      localStorage.setItem(ATTEMPTS_KEY, String(next));

      if (next >= MAX_ATTEMPTS) {
        const until = Date.now() + LOCKOUT_MS;
        setLockoutUntil(until);
        localStorage.setItem(LOCKOUT_UNTIL_KEY, String(until));
      }
    }
  };

  const attemptsLeft = MAX_ATTEMPTS - attempts;

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-5 md:mx-0 md:px-0 md:items-center md:justify-start">
      <div className="w-full max-w-[420px] md:pl-4 lg:pl-0">

        {/* Mobile logo */}
        <motion.div {...fadeUp(0)} className="flex flex-col items-center mb-8 md:hidden">
          <img src="/brand/IKA%20Logo-02.png" alt="IKA" className="w-16 h-16 object-contain mb-3" />
          <h2 className="text-lg font-black text-navy-800">International Knowledge Academy</h2>
        </motion.div>

        <motion.h4 {...fadeUp(0)} className="mb-2 text-3xl font-bold text-navy-800">
          Sign In
        </motion.h4>
        <motion.p {...fadeUp(0.08)} className="mb-8 text-sm text-slate-500">
          Enter your email and password to sign in.
        </motion.p>

        {/* Lockout banner */}
        {isLocked && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-md lg:rounded-lg bg-red-50 border border-red-200 px-4 py-3"
          >
            <p className="text-sm font-semibold text-red-600 mb-0.5">Account temporarily locked</p>
            <p className="text-xs text-red-400">
              Too many failed attempts. Try again in{" "}
              <span className="font-bold tabular-nums">{formatCountdown(remaining)}</span>
            </p>
          </motion.div>
        )}

        <motion.form {...fadeUp(0.16)} onSubmit={handleSubmit}>
          <InputField
            label="Email"
            field="email"
            type="email"
            placeholder="mail@example.com"
            formData={formData}
            errors={errors}
            updateFormData={updateFormData}
            disabled={isLocked}
          />

          <PasswordField
            placeholder="Min. 8 characters"
            formData={formData}
            errors={errors}
            updateFormData={updateFormData}
            disabled={isLocked}
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

          {(errors.general || error) && !isLocked && (
            <div className="mb-3">
              <p className="text-sm text-red-500">{errors.general ?? error}</p>
              {attempts > 0 && attempts < MAX_ATTEMPTS && (
                <p className="text-xs text-slate-400 mt-1">
                  {attemptsLeft} attempt{attemptsLeft !== 1 ? "s" : ""} remaining before lockout.
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || isLocked}
            className="mt-2 w-full rounded-md lg:rounded-lg bg-navy-800 py-3 text-base font-semibold text-white transition duration-200 hover:bg-navy-900 active:bg-navy-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLocked
              ? `Locked — ${formatCountdown(remaining)}`
              : loading
              ? "Signing in..."
              : "Sign In"}
          </button>
        </motion.form>
      </div>
    </div>
  );
}
