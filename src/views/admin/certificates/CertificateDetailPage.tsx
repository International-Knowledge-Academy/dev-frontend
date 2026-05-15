// @ts-nocheck
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MdArrowBack, MdEdit, MdPerson, MdEmail, MdBadge,
  MdSchool, MdLocationOn, MdCalendarToday, MdVerified,
  MdNotes, MdBlock, MdCheckCircle, MdCancel, MdSchedule,
} from "react-icons/md";
import { ShieldOff } from "lucide-react";
import useCertificate from "hooks/certificates/useCertificate";
import useRevokeCertificate from "hooks/certificates/useRevokeCertificate";
import { useToast } from "context/ToastContext";

/* ─── Sub-components ─────────────────────────────────────────────────────── */
const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-4 py-4">
    <div className="w-9 h-9 rounded-xl bg-navy-50 flex items-center justify-center text-navy-400 flex-shrink-0">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-slate-400 mb-0.5">{label}</p>
      <div className="text-sm font-medium text-navy-800 break-words">{value ?? "—"}</div>
    </div>
  </div>
);

const SectionTitle = ({ title }) => (
  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1 px-4 sm:px-6 border-b border-slate-100 p-6">
    {title}
  </p>
);

const formatDate = (d: string) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "—";

const statusConfig = {
  issued:  { cls: "bg-green-50 text-green-700 border-green-100",  icon: <MdCheckCircle size={13} />, label: "Issued"  },
  pending: { cls: "bg-amber-50 text-amber-700 border-amber-100",  icon: <MdSchedule    size={13} />, label: "Pending" },
  revoked: { cls: "bg-red-50   text-red-600   border-red-100",    icon: <MdCancel      size={13} />, label: "Revoked" },
  expired: { cls: "bg-slate-50 text-slate-500 border-slate-200",  icon: <MdCancel      size={13} />, label: "Expired" },
};

/* ─── Revoke Modal ───────────────────────────────────────────────────────── */
const RevokeModal = ({ open, onClose, onConfirm, loading }) => {
  const [reason, setReason] = useState("");
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl w-full max-w-md p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-500 flex-shrink-0">
            <ShieldOff size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold text-navy-800">Revoke Certificate</h2>
            <p className="text-xs text-slate-400 mt-0.5">This action cannot be undone.</p>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-navy-800 mb-1.5">
            Reason <span className="text-red-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder="Enter the reason for revocation..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-navy-800 outline-none focus:ring-2 focus:ring-navy-300 resize-none"
          />
        </div>
        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={() => { onClose(); setReason(""); }}
            className="flex-1 rounded-md lg:rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!reason.trim() || loading}
            onClick={() => onConfirm(reason)}
            className="flex-1 rounded-md lg:rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60 transition"
          >
            {loading ? "Revoking..." : "Revoke Certificate"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Page ───────────────────────────────────────────────────────────────── */
const CertificateDetailPage = () => {
  const { uid }  = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { certificate, loading, error } = useCertificate(uid);
  const { revokeCertificate, loading: revoking } = useRevokeCertificate();
  const [revokeOpen, setRevokeOpen] = useState(false);

  const handleRevoke = async (reason: string) => {
    const result = await revokeCertificate(uid, reason);
    if (result?.success) {
      addToast("Certificate revoked successfully", "success");
      setRevokeOpen(false);
      navigate("/admin/certificates");
    } else {
      addToast("Failed to revoke certificate", "error");
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20 text-sm text-slate-400">Loading certificate...</div>;
  }
  if (error || !certificate) {
    return <div className="flex items-center justify-center py-20 text-sm text-red-500">{error ?? "Certificate not found."}</div>;
  }

  const status = statusConfig[certificate.status] ?? statusConfig.pending;

  return (
    <>
      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

          {/* Header */}
          <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100 flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 rounded-2xl bg-navy-700 flex items-center justify-center text-white flex-shrink-0">
              <MdVerified size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-base font-bold text-navy-800 truncate leading-snug font-mono">
                {certificate.certificate_number || "Draft Certificate"}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5 truncate">{certificate.participant_name}</p>
            </div>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold flex-shrink-0 border ${status.cls}`}>
              {status.icon} {status.label}
            </span>
          </div>

          {/* Participant Info */}
          <SectionTitle title="Participant Details" />
          <div className="px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2">
            <InfoRow icon={<MdPerson size={18} />}   label="Participant Name"    value={certificate.participant_name} />
            <InfoRow icon={<MdEmail size={18} />}    label="Email"              value={certificate.participant_email} />
            <InfoRow icon={<MdBadge size={18} />}    label="ID Number"          value={certificate.participant_id_number} />
          </div>

          {/* Program Info */}
          <SectionTitle title="Program Details" />
          <div className="px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2">
            <InfoRow icon={<MdSchool size={18} />}      label="Program Name"       value={certificate.program_name} />
            <InfoRow icon={<MdCalendarToday size={18} />} label="Duration"         value={certificate.program_duration} />
            <InfoRow icon={<MdLocationOn size={18} />}  label="Training Location"  value={certificate.training_location} />
            <InfoRow icon={<MdCalendarToday size={18} />} label="Training Dates"   value={certificate.training_dates} />
            <InfoRow icon={<MdPerson size={18} />}      label="Lead Trainer"       value={certificate.lead_trainer_name} />
            <InfoRow icon={<MdVerified size={18} />}    label="Issued By"          value={certificate.issued_by} />
            {certificate.certificate_pdf && (
              <InfoRow
                icon={<MdNotes size={18} />}
                label="Certificate PDF"
                value={
                  <a
                    href={certificate.certificate_pdf}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-navy-600 hover:text-gold-600 font-medium transition"
                  >
                    View PDF
                    <span className="text-[10px] text-slate-400">↗</span>
                  </a>
                }
              />
            )}
          </div>

          {/* Certificate Status */}
          <SectionTitle title="Certificate Details" />
          <div className="px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2">
            <InfoRow icon={<MdBadge size={18} />}        label="Certificate Type"     value={certificate.certificate_type ? certificate.certificate_type.charAt(0).toUpperCase() + certificate.certificate_type.slice(1) : "—"} />
            <InfoRow icon={<MdCalendarToday size={18} />} label="Issue Date"          value={formatDate(certificate.issue_date)} />
            <InfoRow icon={<MdVerified size={18} />}     label="Verification Code"    value={certificate.verification_code} />
            <InfoRow icon={<MdCheckCircle size={18} />}  label="Validity"             value={certificate.is_valid} />
            {certificate.special_notes && (
              <InfoRow icon={<MdNotes size={18} />}      label="Special Notes"        value={certificate.special_notes} />
            )}
          </div>

          {/* Revocation (only if revoked) */}
          {certificate.status === "revoked" && (
            <>
              <SectionTitle title="Revocation Details" />
              <div className="px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2">
                <InfoRow icon={<MdBlock size={18} />}        label="Revocation Reason" value={certificate.revocation_reason} />
                <InfoRow icon={<MdCalendarToday size={18} />} label="Revoked At"       value={certificate.revoked_at ? new Date(certificate.revoked_at).toLocaleString("en-GB") : "—"} />
              </div>
            </>
          )}

          {/* Timestamps */}
          <SectionTitle title="Record Details" />
          <div className="px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2">
            <InfoRow icon={<MdCalendarToday size={18} />} label="Created On"    value={formatDate(certificate.created_at)} />
            <InfoRow icon={<MdCalendarToday size={18} />} label="Last Updated"  value={formatDate(certificate.updated_at)} />
          </div>

          {/* Actions */}
          <div className="px-4 sm:px-6 py-4 border-t border-slate-100 flex gap-2 mt-2 flex-wrap">
            <button
              type="button"
              onClick={() => navigate("/admin/certificates")}
              className="flex-1 rounded-md lg:rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition flex items-center justify-center gap-2"
            >
              <MdArrowBack size={16} /> Back
            </button>
            {certificate.status === "issued" && (
              <button
                type="button"
                onClick={() => setRevokeOpen(true)}
                className="flex-1 rounded-md lg:rounded-lg bg-red-50 border border-red-100 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 transition flex items-center justify-center gap-2"
              >
                <ShieldOff size={16} /> Revoke
              </button>
            )}
            <button
              type="button"
              onClick={() => navigate(`/admin/certificates/${uid}/edit`)}
              className="flex-1 rounded-md lg:rounded-lg bg-navy-800 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 transition flex items-center justify-center gap-2"
            >
              <MdEdit size={16} /> Edit
            </button>
          </div>
        </div>
      </div>

      <RevokeModal
        open={revokeOpen}
        onClose={() => setRevokeOpen(false)}
        onConfirm={handleRevoke}
        loading={revoking}
      />
    </>
  );
};

export default CertificateDetailPage;
