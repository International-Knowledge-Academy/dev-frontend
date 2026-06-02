import { useState, useEffect, useCallback } from "react";
import axiosInstance from "api/axiosInstance";
import type { PaginatedProgramTrainers, ProgramTrainerAssignment } from "types/programTrainer";

interface UseTrainerAssignmentsReturn {
  assignments: ProgramTrainerAssignment[];
  count: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const useTrainerAssignments = (trainerProfileUid: string | undefined): UseTrainerAssignmentsReturn => {
  const [assignments, setAssignments] = useState<ProgramTrainerAssignment[]>([]);
  const [count, setCount]             = useState(0);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);

  const fetchAssignments = useCallback(async () => {
    if (!trainerProfileUid) return;
    setLoading(true);
    setError(null);

    try {
      const { data } = await axiosInstance.get<PaginatedProgramTrainers>("/program-trainers", {
        params: { trainer_profile: trainerProfileUid },
      });
      setAssignments(Array.isArray(data.results) ? data.results : []);
      setCount(data.count ?? 0);
    } catch (err: unknown) {
      const responseData = (err as { response?: { data?: any } })?.response?.data;
      setError(
        responseData?.detail ??
        responseData?.message ??
        "Failed to load assigned programs."
      );
    } finally {
      setLoading(false);
    }
  }, [trainerProfileUid]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  return { assignments, count, loading, error, refetch: fetchAssignments };
};

export default useTrainerAssignments;
