import { useState, useEffect } from "react";
import axiosInstance from "api/axiosInstance";
import type { PaginatedPrograms, Program } from "types/program";

interface UseAllProgramsReturn {
  programs: Program[];
  loading: boolean;
  error: string | null;
}

const useAllPrograms = (): UseAllProgramsReturn => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      const results: Program[] = [];
      let page = 1;

      try {
        while (true) {
          const { data } = await axiosInstance.get<PaginatedPrograms>("/programs", {
            params: { page, page_size: 100 },
          });
          results.push(...(data.results ?? []));
          if (!data.next) break;
          page++;
        }
        if (!cancelled) setPrograms(results);
      } catch (err: unknown) {
        if (!cancelled) {
          setError(
            (err as any)?.response?.data?.detail ??
            (err as any)?.response?.data?.message ??
            "Failed to load programs."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchAll();
    return () => { cancelled = true; };
  }, []);

  return { programs, loading, error };
};

export default useAllPrograms;
