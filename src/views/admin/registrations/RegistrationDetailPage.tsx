// @ts-nocheck
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Pencil, CheckCircle, XCircle, GraduationCap, UserCheck,
  CalendarDays, FileText, DollarSign, AlertTriangle, Loader2, UserPlus,
} from "lucide-react";
import DropdownButton from "components/ui/buttons/DropdownButton";
import useGetRegistration from "hooks/registrations/useGetRegistration";
import useRegistrationActions from "hooks/registrations/useRegistrationActions";
import useDeleteRegistration from "hooks/registrations/useDeleteRegistration";
import useAllPrograms from "hooks/programs/useAllPrograms";
import { useToast } from "context/ToastContext";
import Loading from "components/loading/Loading";
import ConfirmModal from "components/ui/modals/ConfirmModal";

const STATUS_COLORS = {
  pending:   "bg-amber-50 text-amber-600 border-amber-200",
  approved:  "bg-green-50 text-green-600 border-green-200",
  rejected:  "bg-red-50 text-red-500 border-red-200",
  completed: "bg-navy-50 text-navy-700 border-navy-200",
  cancelled: "bg-slate-50 text-slate-400 border-slate-200",
};

const DOT_COLORS = {
  pending:   "bg-amber-400",
  approved:  "bg-green-500",
  rejected:  "bg-red-400",
  completed: "bg-navy-600",
  cancelled: "bg-slate-300",
};

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-4 py-3.5">
    <div className="w-9 h-9 rounded-xl bg-navy-50 flex items-center justify-center text-navy-400 flex-shrink-0">
      <Icon size={17} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-slate-400 mb-0.5">{label}</p>
      <div className="text-sm font-medium text-navy-800 break-words">{value ?? "—"}</div>
    </div>
  </div>
);

const SectionTitle = ({ title }) => (
  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1 px-4 sm:px-6 border-b border-slate-100 py-3">
    {title}
  </p>
);

const formatDate = (d: string | null) =>
  d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—";

const RegistrationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const { registration, loading, error, refetch } = useGetRegistration(id);
  const { approve, reject, assignManager, approveState, rejectState, assignManagerState } = useRegistrationActions();
  const { deleteRegistration, loading: deleting } = useDeleteRegistration();
  const { programs } = useAllPrograms();

  const linkedProgram = registration
    ? programs.find((p) => p.id === registration.program)
    : null;

  const [rejectOpen, setRejectOpen]         = useState(false);
  const [rejectReason, setRejectReason]     = useState("");
  const [deleteOpen, setDeleteOpen]         = useState(false);
  const [assignOpen, setAssignOpen]         = useState(false);
  const [managerIdInput, setManagerIdInput] = useState("");

  if (loading) return <Loading text="Loading registration..." />;
  if (error || !registration) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-red-500">
        {error ?? "Registration not found."}
      </div>
    );
  }

  const handleApprove = async () => {
    const ok = await approve(id);
    if (ok) { addToast("Registration approved", "success"); refetch(); }
    else { addToast(approveState.error ?? "Failed to approve", "error"); }
  };

  const handleReject = async () => {
    const ok = await reject(id, rejectReason || undefined);
    if (ok) {
      addToast("Registration rejected", "success");
      setRejectOpen(false);
      setRejectReason("");
      refetch();
    } else {
      addToast(rejectState.error ?? "Failed to reject", "error");
    }
  };

  const handleAssignManager = async () => {
    const mid = Number(managerIdInput);
    if (!mid) return;
    const ok = await assignManager(id, mid);
    if (ok) {
      addToast("Manager assigned", "success");
      setAssignOpen(false);
      setManagerIdInput("");
      refetch();
    } else {
      addToast(assignManagerState.error ?? "Failed to assign manager", "error");
    }
  };

  const handleDelete = async () => {
    const ok = await deleteRegistration(id);
    if (ok) {
      addToast("Registration deleted", "success");
      navigate("/admin/registrations");
    } else {
      addToast("Failed to delete registration", "error");
    }
  };

  const anyActionLoading = approveState.loading || rejectState.loading || assignManagerState.loading;

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100 flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 rounded-2xl bg-navy-700 flex items-center justify-center text-white flex-shrink-0 text-lg font-bold">
            {registration.full_name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-navy-800 truncate leading-snug">{registration.full_name}</h1>
            <p className="text-xs text-slate-400 mt-0.5 truncate">{registration.email}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border capitalize ${STATUS_COLORS[registration.status] ?? "bg-slate-50 text-slate-400 border-slate-200"}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${DOT_COLORS[registration.status] ?? "bg-slate-300"}`} />
              {registration.status}
            </span>
            <DropdownButton
              label="Actions"
              variant="outline"
              loading={anyActionLoading}
              items={[
                { label: "Approve",        icon: <CheckCircle size={14} />,  onClick: handleApprove,              disabled: anyActionLoading || registration.status === "approved"  },
                { label: "Reject",         icon: <XCircle size={14} />,      onClick: () => setRejectOpen(true),  disabled: anyActionLoading || registration.status === "rejected"  },
                { label: "Assign Manager", icon: <UserPlus size={14} />,     onClick: () => setAssignOpen(true),  disabled: anyActionLoading },
                { divider: true },
                { label: "Delete Registration", icon: <AlertTriangle size={14} />, onClick: () => setDeleteOpen(true), danger: true },
              ]}
            />
          </div>
        </div>

        {/* Participant */}
        <SectionTitle title="Participant" />
        <div className="px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2">
          <InfoRow icon={UserCheck}     label="Full Name"         value={registration.full_name} />
          <InfoRow icon={FileText}      label="Email"             value={registration.email} />
          <InfoRow icon={FileText}      label="Phone"             value={registration.phone} />
          <InfoRow icon={FileText}      label="Job Title"         value={registration.job_title} />
          <InfoRow icon={FileText}      label="Address"           value={registration.address} />
          <InfoRow icon={FileText}      label="Registration Type" value={<span className="capitalize">{registration.registration_type}</span>} />
        </div>

        {/* Program */}
        <SectionTitle title="Program" />
        <div className="px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2">
          <InfoRow
            icon={GraduationCap}
            label="Program"
            value={
              linkedProgram ? (
                <button
                  type="button"
                  onClick={() => navigate(`/admin/programs/${linkedProgram.uid}`)}
                  className="flex items-center gap-1.5 text-navy-600 font-semibold hover:text-navy-500 hover:underline underline-offset-2 transition"
                >
                  <GraduationCap size={13} />
                  {linkedProgram.name}
                </button>
              ) : registration.program ? (
                `#${registration.program}`
              ) : "—"
            }
          />
          <InfoRow icon={DollarSign} label="Program Price" value={registration.program_price ? `$${registration.program_price}` : "—"} />
        </div>

        {/* Status & Assignment */}
        <SectionTitle title="Status & Assignment" />
        <div className="px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2">
          <InfoRow icon={FileText}      label="Status"        value={<span className="capitalize">{registration.status}</span>} />
          <InfoRow icon={CalendarDays}  label="Status Changed" value={formatDate(registration.status_changed_at)} />
          <InfoRow icon={UserCheck}     label="Manager ID"   value={registration.manager ? `#${registration.manager}` : "Not assigned"} />
          <InfoRow icon={UserCheck}     label="Approved By"  value={registration.approved_by ? `#${registration.approved_by}` : "—"} />
        </div>

        {/* Certificate */}
        <SectionTitle title="Certificate" />
        <div className="px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2">
          <InfoRow
            icon={FileText}
            label="Certificate Issued"
            value={
              <span className={`font-semibold ${registration.certificate_issued ? "text-green-600" : "text-slate-400"}`}>
                {registration.certificate_issued ? "Yes" : "No"}
              </span>
            }
          />
          <InfoRow icon={CalendarDays} label="Issue Date" value={formatDate(registration.certificate_issue_date)} />
        </div>

        {/* Notes */}
        {registration.admin_notes && (
          <>
            <SectionTitle title="Admin Notes" />
            <div className="px-4 sm:px-6 pb-2">
              <p className="text-sm text-slate-600 whitespace-pre-wrap py-3">{registration.admin_notes}</p>
            </div>
          </>
        )}

        {/* Timestamps */}
        <SectionTitle title="Timestamps" />
        <div className="px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2">
          <InfoRow icon={CalendarDays} label="Registration Date" value={formatDate(registration.registration_date)} />
          <InfoRow icon={CalendarDays} label="Created"           value={formatDate(registration.created_at)} />
          <InfoRow icon={CalendarDays} label="Last Updated"      value={formatDate(registration.updated_at)} />
        </div>

        {/* Footer actions */}
        <div className="px-4 sm:px-6 py-4 border-t border-slate-100 mt-2 flex gap-2">
          <button
            type="button"
            onClick={() => navigate("/admin/registrations")}
            className="flex-1 rounded-md lg:rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => navigate(`/admin/registrations/${id}/edit`)}
            className="flex-1 rounded-md lg:rounded-lg bg-navy-800 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 transition flex items-center justify-center gap-2"
          >
            <Pencil size={15} />
            Edit
          </button>
        </div>
      </div>

      {/* Reject modal */}
      {rejectOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center">
                <XCircle size={18} className="text-red-500" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-navy-800">Reject Registration</h3>
                <p className="text-xs text-slate-400">Optionally provide a rejection reason.</p>
              </div>
            </div>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection (optional)..."
              rows={3}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-navy-800 placeholder-slate-400 focus:outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-100 resize-none"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setRejectOpen(false); setRejectReason(""); }}
                className="flex-1 rounded-md lg:rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={rejectState.loading}
                className="flex-1 rounded-md lg:rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50 transition"
              >
                {rejectState.loading ? "Rejecting..." : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign manager modal */}
      {assignOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-navy-50 border border-navy-100 flex items-center justify-center">
                <UserPlus size={18} className="text-navy-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-navy-800">Assign Manager</h3>
                <p className="text-xs text-slate-400">Enter the manager's user ID.</p>
              </div>
            </div>
            <input
              type="number"
              value={managerIdInput}
              onChange={(e) => setManagerIdInput(e.target.value)}
              placeholder="Manager user ID (e.g. 3)"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-navy-800 placeholder-slate-400 focus:outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-100"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setAssignOpen(false); setManagerIdInput(""); }}
                className="flex-1 rounded-md lg:rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAssignManager}
                disabled={assignManagerState.loading || !managerIdInput}
                className="flex-1 rounded-md lg:rounded-lg bg-navy-800 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 disabled:opacity-50 transition"
              >
                {assignManagerState.loading ? "Assigning..." : "Assign"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={deleteOpen}
        title="Delete Registration"
        message={
          <>
            Are you sure you want to delete the registration for{" "}
            <span className="font-semibold text-navy-800">{registration.full_name}</span>?{" "}
            This cannot be undone.
          </>
        }
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleting}
        icon={<AlertTriangle size={20} className="text-red-500" />}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default RegistrationDetailPage;
