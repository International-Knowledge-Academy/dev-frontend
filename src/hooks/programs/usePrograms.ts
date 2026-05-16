import { useState, useEffect, useCallback } from "react";
import axiosInstance from "api/axiosInstance";
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

const usePrograms = (initialParams: ProgramsParams = {}): UseProgramsReturn => {
  const [programs, setPrograms]   = useState<Program[]>([]);
  const [count, setCount]         = useState(0);
  const [next, setNext]           = useState<string | null>(null);
  const [previous, setPrevious]   = useState<string | null>(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [params, setParamsState]  = useState<ProgramsParams>(initialParams);

  const fetchPrograms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.get<PaginatedPrograms>("/programs", {
        params: {
          ...(params.page         && { page:         params.page }),
          ...(params.search       && { search:       params.search }),
          ...(params.ordering     && { ordering:     params.ordering }),
          ...(params.field        && { field:        params.field }),
          ...(params.location     && { location:     params.location }),
          ...(params.category     && { category:     params.category }),
          ...(params.program_type && { program_type: params.program_type }),
          ...(params.level        && { level:        params.level }),
          ...(params.mode         && { mode:         params.mode }),
          ...(params.language     && { language:     params.language }),
          ...(params.status       && { status:       params.status }),
          ...(params.start_date_from && { start_date_from: params.start_date_from }),
          ...(params.start_date_to   && { start_date_to:   params.start_date_to }),
          ...(params.is_active !== undefined && { is_active: params.is_active }),
          ...(params.trainer         && { trainer:         params.trainer }),
        },
      });
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
        "category"        in updates ||
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

  return { programs, count, next, previous, loading, error, params, setParams, refetch: fetchPrograms };
};

export default usePrograms;
