// @ts-nocheck
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "context/ToastContext";
import useGetReferralCode from "hooks/referralCodes/useGetReferralCode";
import useUpdateReferralCode from "hooks/referralCodes/useUpdateReferralCode";
import InputField from "components/form/InputField";
import ToggleInput from "components/form/toggle/ToggleInput";
import PageHeader from "components/ui/PageHeader";
import Loading from "components/loading/Loading";

const ReferralCodeEditPage = () => {
  const { uid } = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { referralCode, loading: loadingCode } = useGetReferralCode(uid);
  const { updateReferralCode, loading: updating, error, fieldErrors } = useUpdateReferralCode();

  const [form, setForm] = useState({
    code:                "",
    influencer_name:     "",
    influencer_platform: "",
    is_active:           true,
  });

  useEffect(() => {
    if (referralCode) {
      setForm({
        code:                referralCode.code,
        influencer_name:     referralCode.influencer_name,
        influencer_platform: referralCode.influencer_platform,
        is_active:           referralCode.is_active,
      });
    }
  }, [referralCode]);

  const updateFormData = (key: string, value: any) =>
    setForm((p) => ({ ...p, [key]: value }));

  const isFormValid =
    form.code.trim() !== "" &&
    form.influencer_name.trim() !== "" &&
    form.influencer_platform.trim() !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updated = await updateReferralCode(uid, form);
    if (updated) {
      addToast("Referral code updated successfully", "success");
      navigate(`/account-manager/referral-codes/${uid}`);
    } else {
      const firstFieldError = Object.values(fieldErrors)[0];
      addToast(firstFieldError ?? error ?? "Failed to update referral code.", "error");
    }
  };

  if (loadingCode) return <Loading text="Loading referral code..." />;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <PageHeader
          title="Edit Referral Code"
          subtitle={referralCode ? `Editing ${referralCode.code}` : "Edit referral code"}
          bordered
        />

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-600">
              {error}
            </div>
          )}

          <InputField
            label="Code"
            field="code"
            required
            placeholder="e.g. AHMED2026"
            formData={form}
            errors={fieldErrors}
            updateFormData={updateFormData}
          />

          <InputField
            label="Influencer Name"
            field="influencer_name"
            required
            placeholder="e.g. Ahmed Al-Rashidi"
            formData={form}
            errors={fieldErrors}
            updateFormData={updateFormData}
          />

          <InputField
            label="Platform"
            field="influencer_platform"
            required
            placeholder="e.g. https://instagram.com/username"
            formData={form}
            errors={fieldErrors}
            updateFormData={updateFormData}
          />

          <ToggleInput
            label="Active"
            field="is_active"
            formData={form}
            errors={fieldErrors}
            updateFormData={updateFormData}
          />

          <div className="flex gap-2 border-t border-slate-100 pt-4 mt-2">
            <button
              type="button"
              onClick={() => navigate(`/account-manager/referral-codes/${uid}`)}
              className="flex-1 rounded-md lg:rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updating || !isFormValid}
              className="flex-1 rounded-md lg:rounded-lg bg-navy-800 py-2.5 text-sm font-semibold text-white transition enabled:hover:bg-navy-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReferralCodeEditPage;
