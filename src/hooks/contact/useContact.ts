import { useState, useEffect } from "react";
import axiosInstance from "api/axiosInstance";
import type { Contact } from "types/contact";

interface UseContactReturn {
  contact: Contact | null;
  loading: boolean;
  error:   string | null;
}

const useContact = (uid: string | undefined): UseContactReturn => {
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    if (!uid) return;
    setLoading(true);
    setError(null);
    axiosInstance
      .get<Contact>(`/contact/${uid}`)
      .then(({ data }) => setContact(data))
      .catch((err) => {
        setError(
          err?.response?.data?.detail ??
          err?.response?.data?.message ??
          "Failed to load contact."
        );
      })
      .finally(() => setLoading(false));
  }, [uid]);

  return { contact, loading, error };
};

export default useContact;
