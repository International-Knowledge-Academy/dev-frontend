import { useState } from "react";
import axiosInstance from "api/axiosInstance";

interface UseDeleteContactReturn {
  deleteContact: (uid: string) => Promise<boolean>;
  loading: boolean;
  error:   string | null;
}

const useDeleteContact = (): UseDeleteContactReturn => {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const deleteContact = async (uid: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.delete(`/contact/${uid}`);
      return true;
    } catch (err: unknown) {
      const responseData = (err as any)?.response?.data;
      setError(responseData?.detail ?? responseData?.message ?? "Failed to delete contact.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteContact, loading, error };
};

export default useDeleteContact;
