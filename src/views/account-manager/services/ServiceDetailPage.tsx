// @ts-nocheck
import { useNavigate, useParams } from "react-router-dom";
import {
  MdArrowBack, MdEdit, MdLabel, MdNotes,
  MdCheckCircle, MdCancel, MdCalendarToday,
} from "react-icons/md";
import useService from "hooks/services/useService";

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
const ServiceDetailPage = () => {
  const { uid }  = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const { service, loading, error } = useService(uid);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-slate-400">
        Loading service...
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-red-500">
        {error ?? "Service not found."}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

        {/* Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100 flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 rounded-2xl bg-navy-700 flex items-center justify-center text-white text-lg font-extrabold flex-shrink-0">
            {service.name?.charAt(0)?.toUpperCase() ?? "S"}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-navy-800 truncate leading-snug">
              {service.name}
            </h1>
            {service.summary && (
              <p className="text-xs text-slate-400 mt-0.5 truncate">{service.summary}</p>
            )}
          </div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold flex-shrink-0 ${
            service.is_active
              ? "bg-green-50 text-green-700 border border-green-100"
              : "bg-slate-50 text-slate-500 border border-slate-200"
          }`}>
            {service.is_active ? <MdCheckCircle size={13} /> : <MdCancel size={13} />}
            {service.is_active ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Service Info */}
        <SectionTitle title="Service Details" />
        <div className="px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2">
          <InfoRow icon={<MdLabel size={18} />} label="Service Name" value={service.name} />
          <InfoRow
            icon={<MdNotes size={18} />}
            label="Summary"
            value={service.summary || "—"}
          />
        </div>

        {/* Timestamps */}
        <SectionTitle title="Record Details" />
        <div className="px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2">
          <InfoRow
            icon={<MdCalendarToday size={18} />}
            label="Created On"
            value={formatDate(service.created_at)}
          />
          <InfoRow
            icon={<MdCalendarToday size={18} />}
            label="Last Updated"
            value={formatDate(service.updated_at)}
          />
        </div>

        {/* Actions */}
        <div className="px-4 sm:px-6 py-4 border-t border-slate-100 flex gap-2 mt-2">
          <button
            type="button"
            onClick={() => navigate("/account-manager/services")}
            className="flex-1 rounded-md lg:rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition flex items-center justify-center gap-2"
          >
            <MdArrowBack size={16} />
            Back
          </button>
          <button
            type="button"
            onClick={() => navigate(`/account-manager/services/${uid}/edit`)}
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

export default ServiceDetailPage;
