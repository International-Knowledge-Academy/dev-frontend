import { useState } from "react";
import axiosInstance from "api/axiosInstance";

interface UseDeleteReferralCodeReturn {
  deleteReferralCode: (uid: string) => Promise<boolean>;
  loading: boolean;
  error:   string | null;
}

const useDeleteReferralCode = (): UseDeleteReferralCodeReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const deleteReferralCode = async (uid: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.delete(`/referral-codes/${uid}`);
      return true;
    } catch (err: unknown) {
      const d = (err as any)?.response?.data;
      setError(d?.detail ?? d?.message ?? "Failed to delete referral code.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteReferralCode, loading, error };
};

export default useDeleteReferralCode;
