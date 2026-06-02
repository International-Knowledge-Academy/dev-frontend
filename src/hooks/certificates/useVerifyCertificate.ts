import { useState } from "react";
import axiosInstance from "api/axiosInstance";
import type { CertificateVerification, VerifyCertificatePayload } from "types/certificate";

interface UseVerifyCertificateReturn {
  verify: (payload: VerifyCertificatePayload) => Promise<CertificateVerification | null>;
  result: CertificateVerification | null;
  loading: boolean;
  error: string | null;
  reset: () => void;
}

const useVerifyCertificate = (): UseVerifyCertificateReturn => {
  const [result,  setResult]  = useState<CertificateVerification | null>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const verify = async (payload: VerifyCertificatePayload): Promise<CertificateVerification | null> => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const { data } = await axiosInstance.post<CertificateVerification>(
        "/certificates/verify",
        payload
      );
      setResult(data);
      return data;
    } catch (err: unknown) {
      setError(
        (err as any)?.response?.data?.detail ??
        (err as any)?.response?.data?.message ??
        "Certificate could not be verified."
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setResult(null); setError(null); };

  return { verify, result, loading, error, reset };
};

export default useVerifyCertificate;
