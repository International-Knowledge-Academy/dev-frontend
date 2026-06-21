// @ts-nocheck
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Tag, User, Smartphone, Calendar, Users, AlertTriangle } from "lucide-react";
import useGetReferralCode from "hooks/referralCodes/useGetReferralCode";
import useDeleteReferralCode from "hooks/referralCodes/useDeleteReferralCode";
import { useToast } from "context/ToastContext";
import Loading from "components/loading/Loading";
import ConfirmModal from "components/ui/modals/ConfirmModal";

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-4 py-3.5 border-b border-slate-50 last:border-0">
    <div className="w-9 h-9 rounded-xl bg-navy-50 flex items-center justify-center text-navy-400 flex-shrink-0">
      <Icon size={17} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-slate-400 mb-0.5">{label}</p>
      <div className="text-sm font-medium text-navy-800 break-words">{value ?? "—"}</div>
    </div>
  </div>
);

const ReferralCodeDetailPage = () => {
  const { uid } = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { referralCode, loading, error } = useGetReferralCode(uid);
  const { deleteReferralCode, loading: deleting } = useDeleteReferralCode();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = async () => {
    const ok = await deleteReferralCode(uid);
    if (ok) {
      addToast("Referral code deleted.", "success");
      navigate("/admin/referral-codes");
    } else {
      addToast("Failed to delete referral code.", "error");
    }
  };

  if (loading) return <Loading text="Loading referral code..." />;
  if (error)   return <div className="py-20 text-center text-sm text-red-500">{error}</div>;
  if (!referralCode) return null;

  return (
    <>
      <div className="max-w-2xl mx-auto space-y-4">

        {/* Header card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-navy-50 border border-navy-100 flex items-center justify-center flex-shrink-0">
                <Tag size={22} className="text-navy-600" />
              </div>
              <div>
                <h1 className="text-lg font-extrabold text-navy-900 font-mono">{referralCode.code}</h1>
                <p className="text-xs text-slate-400 mt-0.5">{referralCode.influencer_name}</p>
              </div>
            </div>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border ${
              referralCode.is_active
                ? "bg-green-50 text-green-600 border-green-200"
                : "bg-slate-50 text-slate-400 border-slate-200"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${referralCode.is_active ? "bg-green-500" : "bg-slate-300"}`} />
              {referralCode.is_active ? "Active" : "Inactive"}
            </span>
          </div>

          {/* Registrations count highlight */}
          <div className="px-6 py-4 border-b border-slate-100 bg-navy-50/40">
            <div className="flex items-center gap-3">
              <Users size={18} className="text-gold-500" />
              <div>
                <p className="text-2xl font-extrabold text-navy-800 tabular-nums leading-none">
                  {referralCode.registrations_count ?? 0}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">Club registrations via this code</p>
              </div>
            </div>
          </div>

          {/* Info rows */}
          <div className="px-6">
            <InfoRow icon={Tag}        label="Code"         value={<span className="font-mono">{referralCode.code}</span>} />
            <InfoRow icon={User}       label="Influencer"   value={referralCode.influencer_name} />
            <InfoRow icon={Smartphone} label="Platform"     value={referralCode.influencer_platform || "—"} />
            <InfoRow icon={Calendar}   label="Created"      value={new Date(referralCode.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
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
            className="flex-1 rounded-md lg:rounded-lg bg-navy-800 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 transition"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="flex-1 rounded-md lg:rounded-lg bg-red-50 border border-red-200 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 transition"
          >
            Delete
          </button>
        </div>
      </div>

      <ConfirmModal
        open={confirmDelete}
        title="Delete Referral Code"
        message={
          <>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-navy-800">{referralCode.code}</span>?{" "}
            This action cannot be undone.
          </>
        }
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleting}
        icon={<AlertTriangle size={20} className="text-red-500" />}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default ReferralCodeDetailPage;
