import { useState, useEffect, useCallback } from "react";
import axiosInstance from "api/axiosInstance";
import type { Certificate, PaginatedCertificates, CertificatesParams } from "types/certificate";

interface UseCertificatesReturn {
  certificates: Certificate[];
  count: number;
  loading: boolean;
  error: string | null;
  params: CertificatesParams;
  setParams: (updates: Partial<CertificatesParams>) => void;
  refetch: () => void;
}

const useCertificates = (initialParams: CertificatesParams = {}): UseCertificatesReturn => {
  const [allCertificates, setAllCertificates] = useState<Certificate[]>([]);
  const [totalCount,      setTotalCount]      = useState(0);
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState<string | null>(null);
  const [params,          setParamsState]     = useState<CertificatesParams>(initialParams);
  const [tick,            setTick]            = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axiosInstance.get<PaginatedCertificates>("/certificates", {
          params: {
            ...(params.page     && { page:     params.page     }),
            ...(params.ordering && { ordering: params.ordering }),
          },
        });
        if (!cancelled) {
          setAllCertificates(Array.isArray(data.results) ? data.results : []);
          setTotalCount(data.count ?? 0);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(
            (err as any)?.response?.data?.detail ??
            (err as any)?.response?.data?.message ??
            "Failed to load certificates."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetch();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.page, params.ordering, tick]);

  const q = params.search?.toLowerCase().trim() ?? "";
  const certificates = q
    ? allCertificates.filter(
        (c) =>
          c.participant_name?.toLowerCase().includes(q) ||
          c.participant_email?.toLowerCase().includes(q) ||
          c.certificate_number?.toLowerCase().includes(q) ||
          c.program_name?.toLowerCase().includes(q)
      )
    : allCertificates;
  const count = q ? certificates.length : totalCount;

  const setParams = useCallback((updates: Partial<CertificatesParams>) => {
    setParamsState((prev) => ({
      ...prev,
      ...updates,
      page: "ordering" in updates ? 1 : (updates.page ?? prev.page),
    }));
  }, []);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  return { certificates, count, loading, error, params, setParams, refetch };
};

export default useCertificates;
