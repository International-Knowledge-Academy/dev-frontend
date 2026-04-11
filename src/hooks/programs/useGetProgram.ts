import { useState, useEffect } from "react";
import axiosInstance from "api/axiosInstance";
import type { Program } from "types/program";

interface UseGetProgramReturn {
  program: Program | null;
  loading: boolean;
  error: string | null;
}

const useGetProgram = (uid: string | undefined): UseGetProgramReturn => {
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    if (!uid) return;

    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axiosInstance.get<Program>(`/programs/${uid}`);
        setProgram(data);
      } catch (err: unknown) {
        setError(
          (err as any)?.response?.data?.detail ??
          (err as any)?.response?.data?.message ??
          "Failed to load program."
        );
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [uid]);

  return { program, loading, error };
};

export default useGetProgram;
