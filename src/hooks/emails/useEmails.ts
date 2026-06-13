import { useState, useEffect, useCallback } from "react";
import axiosInstance from "api/axiosInstance";

export interface EmailEntry {
  email:      string;
  phone:      string;
  created_at: string;
}

const useEmails = () => {
  const [emails, setEmails]   = useState<EmailEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const fetchEmails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.get("/emails");
      setEmails(Array.isArray(data) ? data : (data.results ?? []));
    } catch {
      setError("Failed to load mailing list.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEmails(); }, [fetchEmails]);

  return { emails, loading, error, refetch: fetchEmails };
};

export default useEmails;
