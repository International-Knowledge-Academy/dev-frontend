// @ts-nocheck
import { useNavigate, useParams } from "react-router-dom";
import { MdEdit, MdArrowBack, MdLink, MdCategory } from "react-icons/md";
import { Handshake } from "lucide-react";
import usePartnership from "hooks/partnerships/usePartnership";

const PARTNERSHIP_TYPE_LABELS: Record<string, string> = {
  certification: "Certification",
  academic:      "Academic",
  corporate:     "Corporate",
  government:    "Government",
  technology:    "Technology",
  media:         "Media",
};

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
  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 px-4 sm:px-6 pt-5 pb-2 border-t border-slate-100">
    {title}
  </p>
);

const PartnershipDetailPage = () => {
  const { uid }  = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const { partnership, loading, error } = usePartnership(uid);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-slate-400">
        Loading partnership...
      </div>
    );
  }

  if (error || !partnership) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-red-500">
        {error ?? "Partnership not found."}
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

        {/* Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100 flex items-center gap-4">
          {partnership.logo?.public_url ? (
            <img
              src={partnership.logo.public_url}
              alt={partnership.name}
              className="w-14 h-14 rounded-2xl object-contain border border-slate-100 bg-white flex-shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-navy-700 flex items-center justify-center text-white flex-shrink-0">
              <Handshake size={22} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-navy-800 truncate leading-snug">{partnership.name}</h1>
            <p className="text-xs text-slate-400 mt-0.5 capitalize">
              {PARTNERSHIP_TYPE_LABELS[partnership.partnership_type] ?? partnership.partnership_type}
            </p>
          </div>
        </div>

        {/* Details */}
        <SectionTitle title="Details" />
        <div className="px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2">
          <InfoRow
            icon={<MdCategory size={18} />}
            label="Partnership Type"
            value={
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-navy-50 text-navy-700 border border-navy-100 capitalize">
                {PARTNERSHIP_TYPE_LABELS[partnership.partnership_type] ?? partnership.partnership_type}
              </span>
            }
          />
          <InfoRow
            icon={<MdLink size={18} />}
            label="Website"
            value={
              partnership.website_url ? (
                <a
                  href={partnership.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-navy-600 hover:underline break-all"
                >
                  {partnership.website_url}
                </a>
              ) : "—"
            }
          />
        </div>

        {/* Actions */}
        <div className="px-4 sm:px-6 py-4 border-t border-slate-100 flex gap-2 mt-2">
          <button
            type="button"
            onClick={() => navigate("/account-manager/partnerships")}
            className="flex-1 rounded-md lg:rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition flex items-center justify-center gap-2"
          >
            <MdArrowBack size={16} />
            Back
          </button>
          <button
            type="button"
            onClick={() => navigate(`/account-manager/partnerships/${uid}/edit`)}
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

export default PartnershipDetailPage;
