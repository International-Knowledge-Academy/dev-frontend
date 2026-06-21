import { useState } from "react";
import axiosInstance from "api/axiosInstance";
import type { ReferralCode, ReferralCodePayload } from "types/referralCode";

interface FieldErrors {
  code?:                string;
  influencer_name?:     string;
  influencer_platform?: string;
}

interface UseCreateReferralCodeReturn {
  createReferralCode: (payload: ReferralCodePayload) => Promise<{ referralCode: ReferralCode | null; fieldErrors: FieldErrors; error: string | null }>;
  loading:     boolean;
  error:       string | null;
  fieldErrors: FieldErrors;
}

const useCreateReferralCode = (): UseCreateReferralCodeReturn => {
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const createReferralCode = async (payload: ReferralCodePayload) => {
    setLoading(true);
    setError(null);
    setFieldErrors({});
    try {
      const { data } = await axiosInstance.post<ReferralCode>("/registrations/referral-codes", payload);
      return { referralCode: data, fieldErrors: {}, error: null };
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
        return { referralCode: null, fieldErrors: extracted, error: null };
      }
      const generalError = responseData?.detail ?? responseData?.message ?? "Failed to create referral code.";
      setError(generalError);
      return { referralCode: null, fieldErrors: {}, error: generalError };
    } finally {
      setLoading(false);
    }
  };

  return { createReferralCode, loading, error, fieldErrors };
};

export default useCreateReferralCode;
