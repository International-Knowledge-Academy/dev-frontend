import { useState, useEffect, useCallback } from "react";
import axiosInstance from "api/axiosInstance";
import { requestCache } from "utils/requestCache";
import type { PaginatedPrograms, Program, ProgramsParams } from "types/program";

interface UseProgramsReturn {
  programs: Program[];
  count: number;
  next: string | null;
  previous: string | null;
  loading: boolean;
  error: string | null;
  params: ProgramsParams;
  setParams: (updates: Partial<ProgramsParams>) => void;
  refetch: () => void;
}

const buildApiParams = (params: ProgramsParams) => ({
  ...(params.page         && { page:            params.page }),
  ...(params.search       && { search:          params.search }),
  ...(params.ordering     && { ordering:        params.ordering }),
  ...(params.field        && { field:           params.field }),
  ...(params.location     && { location:        params.location }),
  ...(params.program_type && { program_type:    params.program_type }),
  ...(params.level        && { level:           params.level }),
  ...(params.mode         && { mode:            params.mode }),
  ...(params.language     && { language:        params.language }),
  ...(params.status       && { status:          params.status }),
  ...(params.start_date_from && { start_date_from: params.start_date_from }),
  ...(params.start_date_to   && { start_date_to:   params.start_date_to }),
  ...(params.is_active !== undefined && { is_active: params.is_active }),
  ...(params.trainer      && { trainer:         params.trainer }),
  ...(params.category     && { category:        params.category }),
});

const usePrograms = (initialParams: ProgramsParams = {}): UseProgramsReturn => {
  const [programs, setPrograms]   = useState<Program[]>([]);
  const [count, setCount]         = useState(0);
  const [next, setNext]           = useState<string | null>(null);
  const [previous, setPrevious]   = useState<string | null>(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [params, setParamsState]  = useState<ProgramsParams>(initialParams);

  const fetchPrograms = useCallback(async (force = false) => {
    const apiParams = buildApiParams(params);
    const cacheKey  = requestCache.key("/programs", apiParams);

    if (!force) {
      const cached = requestCache.get<PaginatedPrograms>(cacheKey);
      if (cached) {
        setPrograms(Array.isArray(cached.results) ? cached.results : []);
        setCount(cached.count ?? 0);
        setNext(cached.next ?? null);
        setPrevious(cached.previous ?? null);
        setLoading(false);
        return;
      }

      const inflight = requestCache.getInflight<PaginatedPrograms>(cacheKey);
      if (inflight) {
        setLoading(true);
        inflight
          .then((data) => {
            setPrograms(Array.isArray(data.results) ? data.results : []);
            setCount(data.count ?? 0);
            setNext(data.next ?? null);
            setPrevious(data.previous ?? null);
            setLoading(false);
          })
          .catch(() => setLoading(false));
        return;
      }
    }

    setLoading(true);
    setError(null);

    const promise = axiosInstance
      .get<PaginatedPrograms>("/programs", { params: apiParams })
      .then(({ data }) => { requestCache.set(cacheKey, data); return data; });

    requestCache.setInflight(cacheKey, promise);

    try {
      const data = await promise;
      setPrograms(Array.isArray(data.results) ? data.results : []);
      setCount(data.count ?? 0);
      setNext(data.next ?? null);
      setPrevious(data.previous ?? null);
    } catch (err: unknown) {
      setError(
        (err as any)?.response?.data?.detail ??
        (err as any)?.response?.data?.message ??
        "Failed to load programs."
      );
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => { fetchPrograms(); }, [fetchPrograms]);

  const setParams = (updates: Partial<ProgramsParams>) => {
    setParamsState((prev) => ({
      ...prev,
      ...updates,
      page:
        "search"          in updates ||
        "field"           in updates ||
        "location"        in updates ||
        "program_type"    in updates ||
        "level"           in updates ||
        "mode"            in updates ||
        "status"          in updates ||
        "start_date_from" in updates ||
        "start_date_to"   in updates ||
        "is_active"       in updates ||
        "trainer"         in updates
          ? 1
          : (updates.page ?? prev.page),
    }));
  };

  const refetch = () => {
    const apiParams = buildApiParams(params);
    requestCache.invalidate(requestCache.key("/programs", apiParams));
    fetchPrograms(true);
  };

  return { programs, count, next, previous, loading, error, params, setParams, refetch };
};

export default usePrograms;
