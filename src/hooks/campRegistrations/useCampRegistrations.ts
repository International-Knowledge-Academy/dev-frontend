import { useState, useEffect, useCallback } from "react";
import axiosInstance from "api/axiosInstance";
import type { CampRegistration, CampRegistrationsParams, PaginatedCampRegistrations } from "types/campRegistration";

interface UseCampRegistrationsReturn {
  registrations: CampRegistration[];
  count:         number;
  next:          string | null;
  previous:      string | null;
  loading:       boolean;
  error:         string | null;
  params:        CampRegistrationsParams;
  setParams:     (updates: Partial<CampRegistrationsParams>) => void;
  refetch:       () => void;
}

const useCampRegistrations = (initialParams: CampRegistrationsParams = {}): UseCampRegistrationsReturn => {
  const [registrations, setRegistrations] = useState<CampRegistration[]>([]);
  const [count, setCount]                 = useState(0);
  const [next, setNext]                   = useState<string | null>(null);
  const [previous, setPrevious]           = useState<string | null>(null);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState<string | null>(null);
  const [params, setParamsState]          = useState<CampRegistrationsParams>(initialParams);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.get<PaginatedCampRegistrations>(
        "/camps/registrations",
        {
          params: {
            ...(params.page              && { page:              params.page }),
            ...(params.search            && { search:            params.search }),
            ...(params.nationality       && { nationality:       params.nationality }),
            ...(params.registration_type && { registration_type: params.registration_type }),
            ...(params.source            && { source:            params.source }),
            ...(params.status            && { status:            params.status }),
          },
        }
      );
      setRegistrations(Array.isArray(data.results) ? data.results : []);
      setCount(data.count ?? 0);
      setNext(data.next ?? null);
      setPrevious(data.previous ?? null);
    } catch (err: unknown) {
      setError(
        (err as any)?.response?.data?.detail ??
        (err as any)?.response?.data?.message ??
        "Failed to load camp registrations."
      );
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => { fetch(); }, [fetch]);

  const setParams = (updates: Partial<CampRegistrationsParams>) => {
    setParamsState((prev) => ({
      ...prev,
      ...updates,
      page:
        "nationality" in updates ||
        "registration_type" in updates ||
        "source" in updates ||
        "status" in updates ||
        "search" in updates
          ? 1
          : (updates.page ?? prev.page),
    }));
  };

  return { registrations, count, next, previous, loading, error, params, setParams, refetch: fetch };
};

export default useCampRegistrations;
