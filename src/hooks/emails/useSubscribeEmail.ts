import { useState } from "react";
import axiosInstance from "api/axiosInstance";

const useSubscribeEmail = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const subscribe = async (email: string, phone?: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.post("/emails", {
        email,
        ...(phone?.trim() && { phone: phone.trim() }),
      });
      return true;
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ??
        err?.response?.data?.email?.[0] ??
        "Something went wrong."
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { subscribe, loading, error };
};

export default useSubscribeEmail;
