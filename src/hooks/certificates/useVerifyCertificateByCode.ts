import { useState, useEffect } from "react";
import axiosInstance from "api/axiosInstance";
import type { CertificateVerification } from "types/certificate";

interface UseVerifyCertificateByCodeReturn {
  result: CertificateVerification | null;
  loading: boolean;
  error: string | null;
}

const useVerifyCertificateByCode = (
  verificationCode: string | undefined
): UseVerifyCertificateByCodeReturn => {
  const [result,  setResult]  = useState<CertificateVerification | null>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    if (!verificationCode) return;
    setLoading(true);
    setError(null);
    setResult(null);
    axiosInstance
      .get<CertificateVerification>(`/certificates/verify/${verificationCode}`)
      .then(({ data }) => setResult(data))
      .catch((err) =>
        setError(
          err?.response?.data?.detail ??
          err?.response?.data?.message ??
          "Certificate could not be verified."
        )
      )
      .finally(() => setLoading(false));
  }, [verificationCode]);

  return { result, loading, error };
};

export default useVerifyCertificateByCode;
