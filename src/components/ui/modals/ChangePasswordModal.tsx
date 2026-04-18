// @ts-nocheck
import { useState } from "react";
import { MdClose, MdLock, MdVisibility, MdVisibilityOff, MdCheckCircle } from "react-icons/md";
import useChangePassword from "hooks/auth/useChangePassword";
import Button from "components/ui/buttons/Button";

interface Props {
  open: boolean;
  onClose: () => void;
}

const PasswordField = ({ label, value, onChange, show, onToggle, placeholder }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-navy-700 dark:text-white">{label}</label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <MdLock size={15} />
      </div>
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-navy-600 bg-white dark:bg-navy-700 text-sm text-navy-800 dark:text-white placeholder-gray-300 focus:outline-none focus:border-navy-400 transition"
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy-600 transition"
      >
        {show ? <MdVisibilityOff size={15} /> : <MdVisibility size={15} />}
      </button>
    </div>
  </div>
);

const ChangePasswordModal = ({ open, onClose }: Props) => {
  const { changePassword, loading, error, success, reset } = useChangePassword();
  const [form, setForm] = useState({ old_password: "", new_password: "", confirm: "" });
  const [show, setShow] = useState({ old: false, new: false, confirm: false });
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!open) return null;

  const set = (key: string, value: string) => {
    setForm((p) => ({ ...p, [key]: value }));
    setValidationError(null);
    reset();
  };

  const handleClose = () => {
    setForm({ old_password: "", new_password: "", confirm: "" });
    setShow({ old: false, new: false, confirm: false });
    setValidationError(null);
    reset();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.new_password !== form.confirm) {
      setValidationError("New passwords do not match.");
      return;
    }
    if (form.new_password.length < 8) {
      setValidationError("New password must be at least 8 characters.");
      return;
    }
    await changePassword({ old_password: form.old_password, new_password: form.new_password });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy-overlay-20 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl dark:bg-navy-800 z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-navy-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-navy-50 dark:bg-navy-900 flex items-center justify-center text-navy-500">
              <MdLock size={16} />
            </div>
            <h2 className="text-base font-bold text-navy-800 dark:text-white">Change Password</h2>
          </div>
          <button onClick={handleClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-navy-700 transition">
            <MdClose size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {success ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
                <MdCheckCircle size={32} className="text-green-500" />
              </div>
              <p className="text-sm font-semibold text-navy-800 dark:text-white">{success}</p>
              <Button
                type="button"
                variant="primary"
                text="Done"
                onClick={handleClose}
                className="rounded-xl px-8"
              />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {(error || validationError) && (
                <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-600">
                  {validationError ?? error}
                </div>
              )}
              <PasswordField
                label="Current Password"
                value={form.old_password}
                onChange={(v) => set("old_password", v)}
                show={show.old}
                onToggle={() => setShow((p) => ({ ...p, old: !p.old }))}
                placeholder="Enter current password"
              />
              <PasswordField
                label="New Password"
                value={form.new_password}
                onChange={(v) => set("new_password", v)}
                show={show.new}
                onToggle={() => setShow((p) => ({ ...p, new: !p.new }))}
                placeholder="At least 8 characters"
              />
              <PasswordField
                label="Confirm New Password"
                value={form.confirm}
                onChange={(v) => set("confirm", v)}
                show={show.confirm}
                onToggle={() => setShow((p) => ({ ...p, confirm: !p.confirm }))}
                placeholder="Repeat new password"
              />
              <div className="flex gap-2 pt-1">
                <Button
                  type="button"
                  text="Cancel"
                  onClick={handleClose}
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
                  text={loading ? "Saving..." : "Update Password"}
                  disabled={loading || !form.old_password || !form.new_password || !form.confirm}
                  className="flex-1 rounded-xl py-2.5"
                />
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
