// @ts-nocheck
import { useState, useEffect } from "react";
import axiosInstance from "api/axiosInstance";
import type { Field } from "types/field";

interface UseGetFieldReturn {
  field: Field | null;
  loading: boolean;
  error: string | null;
}

const useGetField = (uid: string | undefined): UseGetFieldReturn => {
  const [field, setField]   = useState<Field | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    if (!uid) return;
    setLoading(true);
    setError(null);
    axiosInstance
      .get<Field>(`/fields/${uid}`)
      .then(({ data }) => setField(data))
      .catch((err) => {
        const responseData = err?.response?.data;
        setError(responseData?.detail ?? responseData?.message ?? "Failed to load field.");
      })
      .finally(() => setLoading(false));
  }, [uid]);

  return { field, loading, error };
};

export default useGetField;
