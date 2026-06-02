import { useState } from "react";
import axiosInstance from "api/axiosInstance";
import type { Certificate, UpdateCertificatePayload, CertificateFieldErrors } from "types/certificate";

interface UseUpdateCertificateReturn {
  updateCertificate: (uid: string, payload: UpdateCertificatePayload) => Promise<Certificate | null>;
  loading: boolean;
  error: string | null;
  fieldErrors: CertificateFieldErrors;
}

const useUpdateCertificate = (): UseUpdateCertificateReturn => {
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<CertificateFieldErrors>({});

  const updateCertificate = async (
    uid: string,
    payload: UpdateCertificatePayload
  ): Promise<Certificate | null> => {
    setLoading(true);
    setError(null);
    setFieldErrors({});
    try {
      const { data } = await axiosInstance.patch<Certificate>(`/certificates/${uid}`, payload);
      return data;
    } catch (err: unknown) {
      const resData = (err as any)?.response?.data;
      if (resData && typeof resData === "object") {
        const fields: CertificateFieldErrors = {};
        (Object.keys(resData) as string[]).forEach((key) => {
          if (key !== "detail" && key !== "message") {
            (fields as any)[key] = Array.isArray(resData[key]) ? resData[key][0] : resData[key];
          }
        });
        if (Object.keys(fields).length) {
          setFieldErrors(fields);
        } else {
          setError(resData.detail ?? resData.message ?? "Failed to update certificate.");
        }
      } else {
        setError("Failed to update certificate.");
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateCertificate, loading, error, fieldErrors };
};

export default useUpdateCertificate;
