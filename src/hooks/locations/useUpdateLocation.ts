import { useState } from "react";
import axiosInstance from "api/axiosInstance";
import type { Location } from "types/location";

interface FieldErrors {
  name?: string;
  city?: string;
  country?: string;
  address?: string;
  venue_details?: string;
  latitude?: string;
  longitude?: string;
  is_active?: string;
  contact_phone?: string;
  whatsapp_number?: string;
}

interface UseUpdateLocationReturn {
  updateLocation: (uid: string, payload: Partial<Location>) => Promise<Location | void>;
  loading: boolean;
  error: string | null;
  fieldErrors: FieldErrors;
  reset: () => void;
}

const useUpdateLocation = (): UseUpdateLocationReturn => {
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const updateLocation = async (uid: string, payload: Partial<Location>): Promise<Location | void> => {
    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const { data } = await axiosInstance.patch<Location>(`/locations/${uid}`, payload);
      return data;
    } catch (err: unknown) {
      const responseData = (err as { response?: { data?: any } })?.response?.data;

      const fields: (keyof FieldErrors)[] = [
        "name", "city", "country", "address", "venue_details", "latitude", "longitude", "is_active",
        "contact_phone", "whatsapp_number",
      ];

      const extracted: FieldErrors = {};
      fields.forEach((field) => {
        const val = responseData?.[field];
        if (Array.isArray(val) && val[0]) extracted[field] = val[0];
      });

      if (Object.keys(extracted).length) {
        setFieldErrors(extracted);
      } else {
        setError(
          responseData?.detail ??
          responseData?.message ??
          "Failed to update location. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setFieldErrors({});
  };

  return { updateLocation, loading, error, fieldErrors, reset };
};

export default useUpdateLocation;
