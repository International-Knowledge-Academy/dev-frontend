import { useState, useEffect } from "react";
import axiosInstance from "api/axiosInstance";

export interface PublicStats {
  fields:    number;
  locations: number;
  programs:  number;
  loading:   boolean;
}

/* ── Module-level cache ────────────────────────────────────────────────────
   Both About and Stats mount on the same page and call this hook.
   Without a cache each mount fires 3 requests = 6 identical API calls.
   The cache stores the resolved result so the second caller gets it instantly
   and no duplicate requests are made across the session.
─────────────────────────────────────────────────────────────────────────── */
let cached: { fields: number; locations: number; programs: number } | null = null;
let inflight: Promise<{ fields: number; locations: number; programs: number }> | null = null;

const fetchStats = () => {
  if (inflight) return inflight;
  const params = { page_size: 1 };
  inflight = Promise.all([
    axiosInstance.get("/fields",    { params }),
    axiosInstance.get("/locations", { params }),
    axiosInstance.get("/programs",  { params }),
  ]).then(([f, l, p]) => {
    cached = {
      fields:    f.data?.count ?? 0,
      locations: l.data?.count ?? 0,
      programs:  p.data?.count ?? 0,
    };
    return cached;
  });
  return inflight;
};

const usePublicStats = (): PublicStats => {
  const [state, setState] = useState<{ fields: number; locations: number; programs: number }>(
    cached ?? { fields: 0, locations: 0, programs: 0 }
  );
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    if (cached) { setLoading(false); return; }
    fetchStats()
      .then((data) => { setState(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return { ...state, loading };
};

export default usePublicStats;
