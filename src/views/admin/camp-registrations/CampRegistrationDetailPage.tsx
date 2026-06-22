// @ts-nocheck
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  User, Shield, Phone, Mail, Calendar, Globe,
  FileText, CalendarClock, CheckCircle2, XCircle, AlertTriangle, Tag,
  Tent, MapPin, Users, DollarSign,
} from "lucide-react";
import { MdClose } from "react-icons/md";
import DropdownButton from "components/ui/buttons/DropdownButton";
import useGetCampRegistration from "hooks/campRegistrations/useGetCampRegistration";
import useGetCamp from "hooks/camps/useGetCamp";
import useCampRegistrationActions from "hooks/campRegistrations/useCampRegistrationActions";
import useDeleteCampRegistration from "hooks/campRegistrations/useDeleteCampRegistration";
import { useToast } from "context/ToastContext";
import Loading from "components/loading/Loading";
import ConfirmModal from "components/ui/modals/ConfirmModal";

const STATUS_COLORS = {
  pending:             "bg-amber-50 text-amber-600 border-amber-200",
  interview_scheduled: "bg-blue-50 text-blue-600 border-blue-200",
  accepted:            "bg-green-50 text-green-600 border-green-200",
  rejected:            "bg-red-50 text-red-500 border-red-200",
};
const DOT_COLORS = {
  pending:             "bg-amber-400",
  interview_scheduled: "bg-blue-500",
  accepted:            "bg-green-500",
  rejected:            "bg-red-400",
};
const STATUS_LABELS = {
  pending:             "Pending",
  interview_scheduled: "Interview Scheduled",
  accepted:            "Accepted",
  rejected:            "Rejected",
};
const CAMP_STATUS_COLORS = {
  upcoming:  "bg-blue-50 text-blue-600 border-blue-200",
  open:      "bg-green-50 text-green-600 border-green-200",
  closed:    "bg-red-50 text-red-500 border-red-200",
  completed: "bg-slate-50 text-slate-500 border-slate-200",
};
const CAMP_STATUS_LABELS = {
  upcoming: "Upcoming", open: "Open", closed: "Closed", completed: "Completed",
};
import { ARAB_COUNTRIES, HEAR_ABOUT_US_OPTIONS } from "constants/lists";
const NATIONALITY_LABELS    = Object.fromEntries(ARAB_COUNTRIES.map((c) => [c.code, c.name]));
const HEAR_ABOUT_US_LABELS  = Object.fromEntries(HEAR_ABOUT_US_OPTIONS.map((o) => [o.code, o.name]));

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

const formatDateRange = (start: string | null, end: string | null) => {
  if (!start) return null;
  const s = new Date(start);
  const fmtDay = (d: Date) => d.getDate();
  const fmtMon = (d: Date) => d.toLocaleDateString("en-GB", { month: "short" });
  const fmtYear = (d: Date) => d.getFullYear();
  if (!end) return `${fmtDay(s)} ${fmtMon(s)} ${fmtYear(s)}`;
  const e = new Date(end);
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    return `${fmtDay(s)} – ${fmtDay(e)} ${fmtMon(e)} ${fmtYear(e)}`;
  }
  return `${fmtDay(s)} ${fmtMon(s)} – ${fmtDay(e)} ${fmtMon(e)} ${fmtYear(e)}`;
};

const CampRegistrationDetailPage = () => {
  const { uid } = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const { registration, loading, error, refetch } = useGetCampRegistration(uid);
  const { camp } = useGetCamp(registration?.camp);
  const { accept, reject, scheduleInterview, loading: actioning, error: actionError, fieldErrors, clearErrors } = useCampRegistrationActions();
  const { deleteCampRegistration, loading: deleting } = useDeleteCampRegistration();

  const [deleteOpen, setDeleteOpen] = useState(false);

  if (loading) return <Loading text="Loading registration..." />;
  if (error || !registration) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-red-500">
        {error ?? "Registration not found."}
      </div>
    );
  }

  const { participant, guardian, status, registration_type, source, health_notes, referral_source, how_did_you_hear_about_us, referral_code, submitted_at } = registration;

  const handleAccept = async () => {
    const result = await accept(uid);
    if (result) { addToast(`Status updated to ${STATUS_LABELS[result.status]}.`, "success"); refetch(); }
  };

  const handleSchedule = async () => {
    const result = await scheduleInterview(uid);
    if (result) { addToast(`Status updated to ${STATUS_LABELS[result.status]}.`, "success"); refetch(); }
  };

  const handleReject = async () => {
    const result = await reject(uid);
    if (result) { addToast("Registration rejected.", "success"); refetch(); }
  };

  const handleDelete = async () => {
    const ok = await deleteCampRegistration(uid);
    if (ok) { addToast("Registration deleted.", "success"); navigate("/admin/club-registrations"); }
    else     { addToast("Failed to delete.", "error"); }
    setDeleteOpen(false);
  };

  const canSchedule = status === "pending";
  const canAccept   = status === "pending" || status === "interview_scheduled";
  const canReject   = status === "pending" || status === "interview_scheduled";

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

        {/* Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100 flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 rounded-2xl bg-navy-700 flex items-center justify-center text-white flex-shrink-0 text-lg font-bold">
            {participant.first_name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-navy-800 truncate leading-snug">
              {participant.first_name} {participant.last_name}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5 truncate">{participant.email}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border ${STATUS_COLORS[status] ?? "bg-slate-50 text-slate-400 border-slate-200"}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${DOT_COLORS[status] ?? "bg-slate-300"}`} />
              {STATUS_LABELS[status] ?? status}
            </span>
            <DropdownButton
              label="Actions"
              variant="outline"
              loading={actioning}
              items={[
                { label: "Schedule Interview", icon: <CalendarClock size={14} />, onClick: handleSchedule, disabled: actioning || !canSchedule },
                { label: "Accept",             icon: <CheckCircle2 size={14} />,  onClick: handleAccept,   disabled: actioning || !canAccept   },
                { label: "Reject",             icon: <XCircle size={14} />,       onClick: handleReject,   disabled: actioning || !canReject   },
                { divider: true },
                { label: "Delete Registration", icon: <AlertTriangle size={14} />, onClick: () => setDeleteOpen(true), danger: true },
              ]}
            />
          </div>
        </div>

        {/* Inline action error */}
        {(actionError || fieldErrors) && (
          <div className="mx-4 sm:mx-6 mt-4 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600 space-y-1">
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold flex items-center gap-1.5">
                <AlertTriangle size={14} /> Action failed
              </p>
              <button type="button" onClick={clearErrors} className="text-red-400 hover:text-red-600 transition">
                <MdClose size={16} />
              </button>
            </div>
            {actionError && <p>{actionError}</p>}
            {fieldErrors && Object.entries(fieldErrors).map(([field, messages]) =>
              (messages as string[]).map((msg, i) => (
                <p key={`${field}-${i}`}>
                  <span className="font-semibold capitalize">{field.replace(/_/g, " ")}:</span>{" "}{msg}
                </p>
              ))
            )}
          </div>
        )}

        {/* Club */}
        {camp && (
          <>
            <SectionTitle title="Club" />
            <div className="px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2">
              <InfoRow
                icon={Tent}
                label="Club Name"
                value={
                  <span className="flex items-center gap-2">
                    {camp.name}
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${CAMP_STATUS_COLORS[camp.status] ?? "bg-slate-50 text-slate-400 border-slate-200"}`}>
                      {CAMP_STATUS_LABELS[camp.status] ?? camp.status}
                    </span>
                  </span>
                }
              />
              {(camp.start_date || camp.end_date) && (
                <InfoRow icon={Calendar} label="Dates" value={formatDateRange(camp.start_date, camp.end_date)} />
              )}
              {camp.location && (
                <InfoRow icon={MapPin} label="Location" value={camp.location} />
              )}
              {camp.min_age != null && camp.max_age != null && (
                <InfoRow icon={Users} label="Age Range" value={`${camp.min_age} – ${camp.max_age} years`} />
              )}
              {camp.capacity != null && (
                <InfoRow icon={Users} label="Capacity" value={`${camp.capacity} seats`} />
              )}
              {camp.camp_fee && (
                <InfoRow icon={DollarSign} label="Fee" value={camp.camp_fee} />
              )}
              {camp.deadline && (
                <InfoRow icon={Calendar} label="Registration Deadline" value={formatDate(camp.deadline)} />
              )}
            </div>
          </>
        )}

        {/* Participant */}
        <SectionTitle title="Participant" />
        <div className="px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2">
          <InfoRow icon={User}     label="Full Name"     value={`${participant.first_name} ${participant.last_name}`} />
          <InfoRow icon={Mail}     label="Email"         value={participant.email} />
          <InfoRow icon={Phone}    label="WhatsApp"      value={participant.whatsapp} />
          <InfoRow icon={Calendar} label="Date of Birth" value={formatDate(participant.dob)} />
          <InfoRow icon={Globe}    label="Nationality"   value={NATIONALITY_LABELS[participant.nationality] ?? participant.nationality} />
          <InfoRow icon={FileText} label="Passport No."  value={participant.passport_no} />
        </div>

        {/* Guardian (child registrations only) */}
        {registration_type === "child" && guardian && (
          <>
            <SectionTitle title="Guardian" />
            <div className="px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2">
              <InfoRow icon={Shield}   label="Full Name"    value={guardian.full_name} />
              <InfoRow icon={User}     label="Relationship" value={guardian.relationship} />
              <InfoRow icon={Phone}    label="WhatsApp"     value={guardian.whatsapp} />
              <InfoRow icon={Mail}     label="Email"        value={guardian.email} />
            </div>
          </>
        )}

        {/* Registration Details */}
        <SectionTitle title="Registration Details" />
        <div className="px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2">
          <InfoRow icon={User}     label="Registration Type" value={registration_type === "child" ? "Child" : "Self"} />
          <InfoRow icon={Globe}    label="Source"            value={source === "whatsapp" ? "WhatsApp" : source?.charAt(0).toUpperCase() + source?.slice(1)} />
          <InfoRow icon={Calendar} label="Submitted"         value={formatDate(submitted_at)} />
          {how_did_you_hear_about_us && <InfoRow icon={FileText} label="How Did They Hear" value={HEAR_ABOUT_US_LABELS[how_did_you_hear_about_us] ?? how_did_you_hear_about_us} />}
          {referral_source           && <InfoRow icon={FileText} label="Referral Source"    value={referral_source} />}
          {health_notes              && <InfoRow icon={FileText} label="Health Notes"        value={health_notes} />}
          {referral_code && (
            <InfoRow
              icon={Tag}
              label="Referral Code"
              value={
                <span>
                  <span className="font-mono font-semibold text-navy-700">{referral_code.code}</span>
                  <span className="text-slate-400 ml-2 text-xs">— {referral_code.influencer_name}</span>
                </span>
              }
            />
          )}
        </div>

        {/* Footer actions */}
        <div className="px-4 sm:px-6 py-4 border-t border-slate-100 mt-2 flex gap-2">
          <button
            type="button"
            onClick={() => navigate("/admin/club-registrations")}
            className="flex-1 rounded-md lg:rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
          >
            Back
          </button>
        </div>
      </div>

      <ConfirmModal
        open={deleteOpen}
        title="Delete Registration"
        message={
          <>
            Are you sure you want to delete the registration for{" "}
            <span className="font-semibold text-navy-800">{participant.first_name} {participant.last_name}</span>?{" "}
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

export default CampRegistrationDetailPage;
