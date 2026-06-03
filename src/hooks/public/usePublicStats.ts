import { useState, useEffect } from "react";
import axiosInstance from "api/axiosInstance";

export interface PublicStats {
  fields:    number;
  locations: number;
  programs:  number;
  loading:   boolean;
}

const usePublicStats = (): PublicStats => {
  const [fields,    setFields]    = useState(0);
  const [locations, setLocations] = useState(0);
  const [programs,  setPrograms]  = useState(0);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    const params = { page_size: 1 };
    Promise.all([
      axiosInstance.get("/fields",    { params }),
      axiosInstance.get("/locations", { params }),
      axiosInstance.get("/programs",  { params }),
    ])
      .then(([f, l, p]) => {
        setFields(f.data?.count    ?? 0);
        setLocations(l.data?.count ?? 0);
        setPrograms(p.data?.count  ?? 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { fields, locations, programs, loading };
};

export default usePublicStats;
