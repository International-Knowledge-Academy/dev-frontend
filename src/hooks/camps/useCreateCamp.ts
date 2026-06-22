import { useState } from "react";
import axiosInstance from "api/axiosInstance";
import type { Camp, CreateCampPayload } from "types/camp";

const useCreateCamp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const createCamp = async (payload: CreateCampPayload): Promise<Camp | null> => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.post<Camp>("/camps/", payload);
      return data;
    } catch (err: unknown) {
      setError(
        (err as any)?.response?.data?.detail ??
        (err as any)?.response?.data?.message ??
        "Failed to create camp."
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createCamp, loading, error };
};

export default useCreateCamp;
