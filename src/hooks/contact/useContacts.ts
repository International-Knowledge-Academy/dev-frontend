import { useState, useEffect, useCallback } from "react";
import axiosInstance from "api/axiosInstance";
import type { Contact, PaginatedContacts, ContactsParams } from "types/contact";

interface UseContactsReturn {
  contacts: Contact[];
  count:    number;
  loading:  boolean;
  error:    string | null;
  params:   ContactsParams;
  setParams: (updates: Partial<ContactsParams>) => void;
  refetch:  () => void;
}

const useContacts = (initialParams: ContactsParams = {}): UseContactsReturn => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [count,    setCount]    = useState(0);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const [params,   setParamsState] = useState<ContactsParams>(initialParams);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.get<PaginatedContacts>("/contact", {
        params: {
          ...(params.page     && { page:     params.page     }),
          ...(params.search   && { search:   params.search   }),
          ...(params.ordering && { ordering: params.ordering }),
        },
      });
      setContacts(Array.isArray(data.results) ? data.results : []);
      setCount(data.count ?? 0);
    } catch (err: unknown) {
      setError(
        (err as any)?.response?.data?.detail ??
        (err as any)?.response?.data?.message ??
        "Failed to load contacts."
      );
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);

  const setParams = (updates: Partial<ContactsParams>) => {
    setParamsState((prev) => ({
      ...prev,
      ...updates,
      page: "search" in updates || "ordering" in updates ? 1 : (updates.page ?? prev.page),
    }));
  };

  return { contacts, count, loading, error, params, setParams, refetch: fetchContacts };
};

export default useContacts;
