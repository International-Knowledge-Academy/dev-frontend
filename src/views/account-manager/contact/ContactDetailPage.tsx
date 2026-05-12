// @ts-nocheck
import { useNavigate, useParams } from "react-router-dom";
import {
  MdEmail, MdPhone, MdBusiness, MdCategory, MdMessage,
  MdCalendarToday, MdArrowBack, MdEdit,
} from "react-icons/md";
import { CheckCircle2, Clock3 } from "lucide-react";
import useContact from "hooks/contact/useContact";

const getStatusConfig = (status?: string) => {
  switch (status) {
    case "in_progress": return { className: "bg-amber-50 text-amber-700 border border-amber-100",      icon: <Clock3       size={12} />, label: "In Progress" };
    case "follow_up":   return { className: "bg-blue-50 text-blue-700 border border-blue-100",         icon: <Clock3       size={12} />, label: "Follow Up"   };
    case "resolved":    return { className: "bg-emerald-50 text-emerald-700 border border-emerald-100", icon: <CheckCircle2 size={12} />, label: "Resolved"    };
    case "closed":      return { className: "bg-slate-100 text-slate-500 border border-slate-200",     icon: <CheckCircle2 size={12} />, label: "Closed"      };
    case "spam":        return { className: "bg-red-50 text-red-500 border border-red-100",            icon: <CheckCircle2 size={12} />, label: "Spam"        };
    default:            return { className: "bg-slate-100 text-slate-600 border border-slate-200",     icon: <Clock3       size={12} />, label: "Pending"     };
  }
};

/* ─── Sub-components ─────────────────────────────────────────────────────── */
const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-4 py-4">
    <div className="w-9 h-9 rounded-xl bg-navy-50 flex items-center justify-center text-navy-400 flex-shrink-0">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-slate-400 mb-0.5">{label}</p>
      <div className="text-sm font-medium text-navy-800 break-words">{value}</div>
    </div>
  </div>
);

const SectionTitle = ({ title }) => (
  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1 px-4 sm:px-6 border-b border-slate-100 p-6">
    {title}
  </p>
);

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

/* ─── Page ───────────────────────────────────────────────────────────────── */
const ContactDetailPage = () => {
  const { uid }  = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const { contact, loading, error } = useContact(uid);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-slate-400">
        Loading submission...
      </div>
    );
  }

  if (error || !contact) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-red-500">
        {error ?? "Submission not found."}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

        {/* Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100 flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 rounded-2xl bg-navy-700 flex items-center justify-center text-white text-lg font-extrabold flex-shrink-0">
            {contact.full_name?.charAt(0)?.toUpperCase() ?? "?"}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-navy-800 truncate leading-snug">
              {contact.full_name}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5 truncate">
              {contact.email}
              {contact.organization && ` · ${contact.organization}`}
            </p>
          </div>
          {(() => {
            const { className, icon, label } = getStatusConfig(contact.status);
            return (
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold flex-shrink-0 ${className}`}>
                {icon}
                {label}
              </span>
            );
          })()}
        </div>

        {/* Contact Info */}
        <SectionTitle title="Contact Information" />
        <div className="px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2">
          <InfoRow icon={<MdEmail    size={18} />} label="Email Address" value={
            <a href={`mailto:${contact.email}`} className="text-navy-600 hover:underline">
              {contact.email}
            </a>
          } />
          <InfoRow icon={<MdPhone    size={18} />} label="Phone / WhatsApp" value={contact.phone_whatsapp || "—"} />
          <InfoRow icon={<MdBusiness size={18} />} label="Organization"     value={contact.organization || "—"} />
        </div>

        {/* Program Interest */}
        <SectionTitle title="Program Interest" />
        <div className="px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2">
          <InfoRow icon={<MdCategory size={18} />} label="Program Category" value={contact.program_category || "—"} />
          <InfoRow icon={<MdCategory size={18} />} label="Program Type"     value={
            contact.program_type
              ? <span className="capitalize">{contact.program_type.replace(/_/g, " ")}</span>
              : "—"
          } />
        </div>

        {/* Message */}
        <SectionTitle title="Message" />
        <div className="px-4 sm:px-6 py-4">
          <div className="bg-slate-50 rounded-xl border border-slate-100 p-5">
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {contact.message || "—"}
            </p>
          </div>
        </div>

        {/* Submission Details */}
        <SectionTitle title="Submission Details" />
        <div className="px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2">
          <InfoRow
            icon={<MdCalendarToday size={18} />}
            label="Submitted On"
            value={formatDate(contact.created_at)}
          />
          <InfoRow
            icon={<CheckCircle2 size={18} />}
            label="Status"
            value={(() => {
              const { className, icon, label } = getStatusConfig(contact.status);
              return (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${className}`}>
                  {icon}
                  {label}
                </span>
              );
            })()}
          />
        </div>

        {/* Actions */}
        <div className="px-4 sm:px-6 py-4 border-t border-slate-100 flex gap-2 mt-2">
          <button
            type="button"
            onClick={() => navigate("/account-manager/contact")}
            className="flex-1 rounded-md lg:rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition flex items-center justify-center gap-2"
          >
            <MdArrowBack size={16} />
            Back
          </button>
          <button
            type="button"
            onClick={() => navigate(`/account-manager/contact/${uid}/edit`)}
            className="flex-1 rounded-md lg:rounded-lg bg-navy-800 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 transition flex items-center justify-center gap-2"
          >
            <MdEdit size={16} />
            Edit
          </button>
        </div>

      </div>
    </div>
  );
};

export default ContactDetailPage;
