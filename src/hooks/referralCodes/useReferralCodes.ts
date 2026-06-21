import { useState, useEffect, useCallback } from "react";
import axiosInstance from "api/axiosInstance";
import type { PaginatedReferralCodes, ReferralCode, ReferralCodesParams } from "types/referralCode";

interface UseReferralCodesReturn {
  referralCodes: ReferralCode[];
  count:         number;
  next:          string | null;
  previous:      string | null;
  loading:       boolean;
  error:         string | null;
  params:        ReferralCodesParams;
  setParams:     (updates: Partial<ReferralCodesParams>) => void;
  refetch:       () => void;
}

const useReferralCodes = (initialParams: ReferralCodesParams = {}): UseReferralCodesReturn => {
  const [referralCodes, setReferralCodes] = useState<ReferralCode[]>([]);
  const [count, setCount]                 = useState(0);
  const [next, setNext]                   = useState<string | null>(null);
  const [previous, setPrevious]           = useState<string | null>(null);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState<string | null>(null);
  const [params, setParamsState]          = useState<ReferralCodesParams>(initialParams);

  const fetchReferralCodes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.get<PaginatedReferralCodes>(
        "/registrations/referral-codes/",
        {
          params: {
            ...(params.page      && { page:      params.page }),
            ...(params.search    && { search:    params.search }),
            ...(params.is_active !== undefined && { is_active: params.is_active }),
          },
        }
      );
      setReferralCodes(Array.isArray(data.results) ? data.results : []);
      setCount(data.count ?? 0);
      setNext(data.next ?? null);
      setPrevious(data.previous ?? null);
    } catch (err: unknown) {
      setError(
        (err as any)?.response?.data?.detail ??
        (err as any)?.response?.data?.message ??
        "Failed to load referral codes."
      );
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => { fetchReferralCodes(); }, [fetchReferralCodes]);

  const setParams = (updates: Partial<ReferralCodesParams>) => {
    setParamsState((prev) => ({
      ...prev,
      ...updates,
      page:
        "search"    in updates ||
        "is_active" in updates
          ? 1
          : (updates.page ?? prev.page),
    }));
  };

  return { referralCodes, count, next, previous, loading, error, params, setParams, refetch: fetchReferralCodes };
};

export default useReferralCodes;
