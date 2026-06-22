import { useState } from "react";
import axiosInstance from "api/axiosInstance";
import type { Camp, CreateCampPayload } from "types/camp";

const useUpdateCamp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const updateCamp = async (uid: string, payload: Partial<CreateCampPayload>): Promise<Camp | null> => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.patch<Camp>(`/camps/${uid}`, payload);
      return data;
    } catch (err: unknown) {
      setError(
        (err as any)?.response?.data?.detail ??
        (err as any)?.response?.data?.message ??
        "Failed to update camp."
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateCamp, loading, error };
};

export default useUpdateCamp;
