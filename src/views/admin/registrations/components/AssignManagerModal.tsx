// @ts-nocheck
import { useState, useMemo } from "react";
import { MdClose, MdSearch, MdCheck } from "react-icons/md";
import { UserCog } from "lucide-react";
import useUsers from "hooks/users/useUsers";
import useAssignRegistrationManager from "hooks/registrations/useAssignRegistrationManager";
import { useToast } from "context/ToastContext";
import type { Registration } from "types/registration";
import type { User } from "types/auth";

interface AssignManagerModalProps {
  open: boolean;
  registration: Registration | null;
  onClose: () => void;
  onSuccess: () => void;
}

const AssignManagerModal = ({ open, registration, onClose, onSuccess }: AssignManagerModalProps) => {
  const { addToast } = useToast();
  const { users: managers, loading: loadingManagers } = useUsers({ role: "account_manager" });
  const { assignManager, loading, error } = useAssignRegistrationManager();

  const [search, setSearch]     = useState("");
  const [selected, setSelected] = useState<User | null>(null);

  const filtered = useMemo(() =>
    managers.filter((m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
    ),
    [managers, search]
  );

  const handleClose = () => {
    setSearch("");
    setSelected(null);
    onClose();
  };

  const handleSubmit = async () => {
    if (!selected || !registration) return;
    const ok = await assignManager(registration.uid, selected.uid);
    if (ok) {
      addToast(`${selected.name} assigned as manager`, "success");
      handleClose();
      onSuccess();
    } else {
      addToast(error ?? "Failed to assign manager", "error");
    }
  };

  if (!open || !registration) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy-overlay-20 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl z-10 flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-navy-50 flex items-center justify-center text-navy-600">
              <UserCog size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-navy-800">Assign Manager</h2>
              <p className="text-xs text-slate-400 truncate max-w-[260px]" title={registration.full_name}>
                {registration.full_name}
              </p>
            </div>
          </div>
          <button onClick={handleClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition">
            <MdClose size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-navy-700">
              Select Manager <span className="text-red-500">*</span>
            </label>
            {selected && (
              <span className="text-xs font-semibold text-navy-600 bg-navy-50 border border-navy-100 px-2 py-0.5 rounded-md">
                {selected.name}
              </span>
            )}
          </div>

          <div className="relative mb-2">
            <MdSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 outline-none focus:ring-1 focus:ring-navy-400 focus:border-navy-400"
            />
          </div>

          <div className="rounded-xl border border-slate-100 overflow-y-auto max-h-64">
            {loadingManagers ? (
              <p className="text-xs text-slate-400 text-center py-6">Loading managers...</p>
            ) : filtered.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No managers found.</p>
            ) : (
              filtered.map((manager) => {
                const isSelected = selected?.uid === manager.uid;
                const initials   = manager.name
                  ?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) ?? "?";
                return (
                  <button
                    key={manager.uid}
                    type="button"
                    onClick={() => setSelected(isSelected ? null : manager)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition border-b border-slate-50 last:border-0 ${
                      isSelected ? "bg-navy-50" : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-navy-700 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-navy-800 truncate">{manager.name}</p>
                      <p className="text-xs text-slate-400 truncate">{manager.email}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition ${
                      isSelected ? "bg-navy-600 border-navy-600 text-white" : "border-slate-300"
                    }`}>
                      {isSelected && <MdCheck size={13} />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-6 py-4 border-t border-slate-100 flex-shrink-0">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 py-2.5 rounded-md lg:rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !selected}
            className="flex-1 py-2.5 rounded-md lg:rounded-lg bg-navy-800 text-sm font-medium text-white hover:bg-navy-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Assigning..." : "Assign Manager"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignManagerModal;
