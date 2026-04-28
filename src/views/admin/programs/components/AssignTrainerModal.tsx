// @ts-nocheck
import { useState, useMemo } from "react";
import { MdClose, MdSchool, MdSearch, MdStar, MdCheck } from "react-icons/md";
import useUsers from "hooks/users/useUsers";
import useAssignTrainer from "hooks/trainers/useAssignTrainer";
import { useToast } from "context/ToastContext";
import type { Program } from "types/program";
import type { User } from "types/auth";

interface AssignTrainerModalProps {
  open: boolean;
  program: Program | null;
  onClose: () => void;
  onSuccess: () => void;
}

const AssignTrainerModal = ({ open, program, onClose, onSuccess }: AssignTrainerModalProps) => {
  const { addToast } = useToast();
  const { users: trainers, loading: loadingTrainers } = useUsers({ role: "trainer" });
  const { assign, loading, error, fieldErrors, reset } = useAssignTrainer();

  const [search, setSearch]             = useState("");
  const [selected, setSelected]         = useState<User | null>(null);
  const [isLead, setIsLead]             = useState(false);
  const [notes, setNotes]               = useState("");

  const filtered = useMemo(() =>
    trainers.filter((t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase())
    ),
    [trainers, search]
  );

  const handleClose = () => {
    setSearch("");
    setSelected(null);
    setIsLead(false);
    setNotes("");
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    if (!selected || !program) return;
    if (!selected.profile?.uid) {
      addToast("This trainer has no profile set up yet.", "error");
      return;
    }
    const result = await assign({
      trainer_profile:    selected.profile.uid,
      program:            program.uid,
      is_lead_instructor: isLead,
      notes:              notes.trim() || undefined,
    });
    if (result) {
      addToast(`${selected.name} assigned to "${program.name}"`, "success");
      handleClose();
      onSuccess();
    }
  };

  if (!open || !program) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy-overlay-20 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl z-10 flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
              <MdSchool size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-navy-800">Assign Trainer</h2>
              <p className="text-xs text-gray-400 truncate max-w-[260px]" title={program.name}>
                {program.name}
              </p>
            </div>
          </div>
          <button onClick={handleClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition">
            <MdClose size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">

          {/* Trainer search */}
          <div>
            <label className="block text-xs font-semibold text-navy-700 mb-2">
              Select Trainer <span className="text-red-500">*</span>
            </label>
            <div className="relative mb-2">
              <MdSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 outline-none focus:ring-1 focus:ring-navy-400 focus:border-navy-400"
              />
            </div>

            <div className="rounded-xl border border-gray-100 overflow-y-auto max-h-52">
              {loadingTrainers ? (
                <p className="text-xs text-gray-400 text-center py-6">Loading trainers...</p>
              ) : filtered.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-6">No trainers found.</p>
              ) : (
                filtered.map((trainer) => {
                  const isSelected = selected?.uid === trainer.uid;
                  const initials   = trainer.name
                    ?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) ?? "?";
                  return (
                    <button
                      key={trainer.uid}
                      type="button"
                      onClick={() => setSelected(isSelected ? null : trainer)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition border-b border-gray-50 last:border-0 ${
                        isSelected ? "bg-green-50" : "hover:bg-gray-50"
                      }`}
                    >
                      {trainer.profile?.profile_picture ? (
                        <img
                          src={trainer.profile.profile_picture}
                          alt={trainer.name}
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {initials}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-navy-800 truncate">{trainer.name}</p>
                        <p className="text-xs text-gray-400 truncate">{trainer.profile?.title || trainer.email}</p>
                      </div>
                      {isSelected && (
                        <MdCheck size={16} className="text-green-600 flex-shrink-0" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
            {fieldErrors?.trainer_profile && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.trainer_profile}</p>
            )}
          </div>

          {/* Lead instructor toggle */}
          <div className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <MdStar size={16} className={isLead ? "text-gold-500" : "text-gray-300"} />
              <div>
                <p className="text-sm font-medium text-navy-800">Lead Instructor</p>
                <p className="text-xs text-gray-400">Mark as the primary trainer for this program</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsLead((v) => !v)}
              className={`relative w-10 h-5.5 rounded-full transition-colors flex-shrink-0 ${isLead ? "bg-navy-600" : "bg-gray-300"}`}
              style={{ height: "22px" }}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${isLead ? "translate-x-5" : "translate-x-0.5"}`}
              />
            </button>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-navy-700 mb-2">
              Notes <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any notes about this assignment..."
              rows={2}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 outline-none focus:ring-1 focus:ring-navy-400 focus:border-navy-400 resize-none"
            />
          </div>

          {/* General error */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-6 py-4 border-t border-gray-100 flex-shrink-0">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 py-2.5 rounded-md lg:rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !selected}
            className="flex-1 py-2.5 rounded-md lg:rounded-lg bg-navy-800 text-sm font-medium text-white hover:bg-navy-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Assigning..." : "Assign Trainer"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignTrainerModal;
