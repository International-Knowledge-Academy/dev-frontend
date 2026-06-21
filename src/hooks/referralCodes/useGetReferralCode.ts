import { useState, useEffect } from "react";
import axiosInstance from "api/axiosInstance";
import type { ReferralCode } from "types/referralCode";

interface UseGetReferralCodeReturn {
  referralCode: ReferralCode | null;
  loading:      boolean;
  error:        string | null;
}

const useGetReferralCode = (uid: string | undefined): UseGetReferralCodeReturn => {
  const [referralCode, setReferralCode] = useState<ReferralCode | null>(null);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState<string | null>(null);

  useEffect(() => {
    if (!uid) return;
    setLoading(true);
    setError(null);
    axiosInstance
      .get<ReferralCode>(`/registrations/referral-codes/${uid}/`)
      .then(({ data }) => setReferralCode(data))
      .catch((err) => {
        const d = err?.response?.data;
        setError(d?.detail ?? d?.message ?? "Failed to load referral code.");
      })
      .finally(() => setLoading(false));
  }, [uid]);

  return { referralCode, loading, error };
};

export default useGetReferralCode;
