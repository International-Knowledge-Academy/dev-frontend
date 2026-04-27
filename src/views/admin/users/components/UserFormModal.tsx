// @ts-nocheck
import { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import type { User } from "types/auth";

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  loading: boolean;
  error: string | null;
  fieldErrors: Record<string, string>;
  user?: User | null;
}

const ROLES = [
  { value: "admin",           label: "Admin" },
  { value: "account_manager", label: "Account Manager" },
];

const UserFormModal = ({
  open, onClose, onSubmit, loading, error, fieldErrors, user,
}: UserFormModalProps) => {
  const isEdit = !!user;

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
    } else {
      setForm({ name: "", email: "", password: "", role: "account_manager", is_active: true });
    }
  }, [user, open]);

  if (!open) return null;

  const field = (key: string) => ({
    value: form[key],
    onChange: (e) => setForm((p) => ({ ...p, [key]: e.target.value })),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload: any = { name: form.name, email: form.email, role: form.role, is_active: form.is_active };
    if (form.password) payload.password = form.password;
    await onSubmit(payload);
  };

  const inputCls = (key: string) =>
    `w-full rounded-xl border px-4 py-2.5 text-sm text-navy-800 outline-none transition focus:ring-2 focus:ring-navy-300 ${
      fieldErrors[key] ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-navy-800">
            {isEdit ? "Edit User" : "Create User"}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition">
            <MdClose size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-navy-600 mb-1.5">Full Name</label>
            <input {...field("name")} required placeholder="John Doe" className={inputCls("name")} />
            {fieldErrors.name && <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-navy-600 mb-1.5">Email</label>
            <input {...field("email")} type="email" required placeholder="john@example.com" className={inputCls("email")} />
            {fieldErrors.email && <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-navy-600 mb-1.5">
              Password {isEdit && <span className="text-gray-400 font-normal">(leave blank to keep current)</span>}
            </label>
            <input {...field("password")} type="password" placeholder="••••••••" required={!isEdit} className={inputCls("password")} />
            {fieldErrors.password && <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>}
          </div>

          {/* Role */}
          <div>
            <label className="block text-xs font-semibold text-navy-600 mb-1.5">Role</label>
            <select {...field("role")} className={inputCls("role")}>
              {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
            {fieldErrors.role && <p className="mt-1 text-xs text-red-500">{fieldErrors.role}</p>}
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between rounded-xl bg-gray-50 border border-gray-200 px-4 py-3">
            <span className="text-sm font-medium text-navy-700">Active</span>
            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, is_active: !p.is_active }))}
              className={`relative w-10 h-5 rounded-full transition-colors ${form.is_active ? "bg-navy-700" : "bg-gray-300"}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.is_active ? "translate-x-5" : ""}`} />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 rounded-xl bg-navy-800 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 transition disabled:opacity-60">
              {loading ? "Saving..." : isEdit ? "Save Changes" : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
