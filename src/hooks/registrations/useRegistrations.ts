import { useState, useEffect, useCallback } from "react";
import axiosInstance from "api/axiosInstance";
import type { PaginatedRegistrations, Registration, RegistrationsParams } from "types/registration";

interface UseRegistrationsReturn {
  registrations: Registration[];
  count: number;
  next: string | null;
  previous: string | null;
  loading: boolean;
  error: string | null;
  params: RegistrationsParams;
  setParams: (updates: Partial<RegistrationsParams>) => void;
  refetch: () => void;
}

const useRegistrations = (initialParams: RegistrationsParams = {}): UseRegistrationsReturn => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [count, setCount]                 = useState(0);
  const [next, setNext]                   = useState<string | null>(null);
  const [previous, setPrevious]           = useState<string | null>(null);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState<string | null>(null);
  const [params, setParamsState]          = useState<RegistrationsParams>(initialParams);

  const fetchRegistrations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.get<PaginatedRegistrations>("/registrations", {
        params: {
          ...(params.page              && { page:              params.page }),
          ...(params.search            && { search:            params.search }),
          ...(params.ordering          && { ordering:          params.ordering }),
          ...(params.status            && { status:            params.status }),
          ...(params.registration_type && { registration_type: params.registration_type }),
          ...(params.program           && { program:           params.program }),
        },
      });
      setRegistrations(Array.isArray(data.results) ? data.results : []);
      setCount(data.count ?? 0);
      setNext(data.next ?? null);
      setPrevious(data.previous ?? null);
    } catch (err: unknown) {
      setError(
        (err as any)?.response?.data?.detail ??
        (err as any)?.response?.data?.message ??
        "Failed to load registrations."
      );
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => { fetchRegistrations(); }, [fetchRegistrations]);

  const setParams = (updates: Partial<RegistrationsParams>) => {
    setParamsState((prev) => ({
      ...prev,
      ...updates,
      page: "search" in updates || "ordering" in updates || "status" in updates || "registration_type" in updates || "program" in updates
        ? 1
        : (updates.page ?? prev.page),
    }));
  };

  return { registrations, count, next, previous, loading, error, params, setParams, refetch: fetchRegistrations };
};

export default useRegistrations;
