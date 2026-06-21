import { useState } from "react";
import axiosInstance from "api/axiosInstance";
import type { ReferralCode, ReferralCodePayload } from "types/referralCode";

interface FieldErrors {
  code?:                string;
  influencer_name?:     string;
  influencer_platform?: string;
}

interface UseUpdateReferralCodeReturn {
  updateReferralCode: (uid: string, payload: Partial<ReferralCodePayload>) => Promise<ReferralCode | null>;
  loading:     boolean;
  error:       string | null;
  fieldErrors: FieldErrors;
}

const useUpdateReferralCode = (): UseUpdateReferralCodeReturn => {
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const updateReferralCode = async (uid: string, payload: Partial<ReferralCodePayload>): Promise<ReferralCode | null> => {
    setLoading(true);
    setError(null);
    setFieldErrors({});
    try {
      const { data } = await axiosInstance.patch<ReferralCode>(`/registrations/referral-codes/${uid}/`, payload);
      return data;
    } catch (err: unknown) {
      const responseData = (err as any)?.response?.data;
      const fields: (keyof FieldErrors)[] = ["code", "influencer_name", "influencer_platform"];
      const extracted: FieldErrors = {};
      fields.forEach((f) => {
        const val = responseData?.[f];
        if (Array.isArray(val) && val[0]) extracted[f] = val[0];
      });
      if (Object.keys(extracted).length) {
        setFieldErrors(extracted);
        return null;
      }
      setError(responseData?.detail ?? responseData?.message ?? "Failed to update referral code.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateReferralCode, loading, error, fieldErrors };
};

export default useUpdateReferralCode;
