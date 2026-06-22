// @ts-nocheck
import { useNavigate, useParams } from "react-router-dom";
import {
  MdEdit, MdTag, MdPerson, MdPhoneAndroid,
  MdCalendarToday, MdToggleOn, MdGroup,
} from "react-icons/md";
import useGetReferralCode from "hooks/referralCodes/useGetReferralCode";
import Loading from "components/loading/Loading";

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
  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 px-4 sm:px-6 pt-5 pb-2 border-t border-slate-100">
    {title}
  </p>
);

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

const ReferralCodeDetailPage = () => {
  const { uid } = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const { referralCode, loading, error } = useGetReferralCode(uid);

  if (loading) return <Loading text="Loading referral code..." />;

  if (error || !referralCode) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-red-500">
        {error ?? "Referral code not found."}
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

        {/* Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100 flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 rounded-2xl bg-navy-700 flex items-center justify-center text-white flex-shrink-0">
            <MdTag size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-navy-800 truncate leading-snug font-mono tracking-wider">
              {referralCode.code}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5 truncate">{referralCode.influencer_name}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border ${
              referralCode.is_active
                ? "bg-green-50 text-green-600 border-green-200"
                : "bg-slate-50 text-slate-400 border-slate-200"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${referralCode.is_active ? "bg-green-500" : "bg-slate-300"}`} />
              {referralCode.is_active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        {/* Code Details */}
        <SectionTitle title="Referral Code" />
        <div className="px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2">
          <InfoRow
            icon={<MdTag size={18} />}
            label="Code"
            value={<span className="font-mono tracking-wider">{referralCode.code}</span>}
          />
          <InfoRow
            icon={<MdPerson size={18} />}
            label="Influencer Name"
            value={referralCode.influencer_name || "—"}
          />
          <InfoRow
            icon={<MdPhoneAndroid size={18} />}
            label="Platform"
            value={
              referralCode.influencer_platform ? (
                <a
                  href={referralCode.influencer_platform}
                  target="_blank"
                  rel="noreferrer"
                  className="text-navy-600 underline hover:text-navy-800 transition"
                >
                  Social Media
                </a>
              ) : "—"
            }
          />
          <InfoRow
            icon={<MdToggleOn size={18} />}
            label="Status"
            value={
              <span className={`font-semibold ${referralCode.is_active ? "text-green-500" : "text-slate-400"}`}>
                {referralCode.is_active ? "Active" : "Inactive"}
              </span>
            }
          />
        </div>

        {/* Stats */}
        <SectionTitle title="Stats" />
        <div className="px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2">
          <InfoRow
            icon={<MdGroup size={18} />}
            label="Club Registrations"
            value={
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-gold-50 text-gold-600 border border-gold-200">
                {referralCode.registrations_count ?? 0} registration{referralCode.registrations_count !== 1 ? "s" : ""}
              </span>
            }
          />
        </div>

        {/* Timestamps */}
        <SectionTitle title="Timestamps" />
        <div className="px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2">
          <InfoRow
            icon={<MdCalendarToday size={18} />}
            label="Created"
            value={formatDate(referralCode.created_at)}
          />
        </div>

        {/* Actions */}
        <div className="px-4 sm:px-6 py-4 border-t border-slate-100 flex gap-2 mt-2">
          <button
            type="button"
            onClick={() => navigate("/admin/referral-codes")}
            className="flex-1 rounded-md lg:rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => navigate(`/admin/referral-codes/${uid}/edit`)}
            className="flex-1 rounded-md lg:rounded-lg bg-navy-800 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 transition flex items-center justify-center gap-2"
          >
            <MdEdit size={16} />
            Edit Code
          </button>
        </div>

      </div>

    </div>
  );
};

export default ReferralCodeDetailPage;
