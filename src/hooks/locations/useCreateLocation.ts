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
  contact_phone?: string;
  whatsapp_number?: string;
}

export interface CreateLocationResult {
  location: Location | null;
  fieldErrors: FieldErrors;
  error: string | null;
}

interface UseCreateLocationReturn {
  createLocation: (payload: any) => Promise<CreateLocationResult>;
  loading: boolean;
  error: string | null;
  fieldErrors: FieldErrors;
}

const useCreateLocation = (): UseCreateLocationReturn => {
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const createLocation = async (payload: any): Promise<CreateLocationResult> => {
    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const { data } = await axiosInstance.post<Location>("/locations", payload);
      return { location: data, fieldErrors: {}, error: null };
    } catch (err: unknown) {
      const responseData = (err as { response?: { data?: any } })?.response?.data;

      const fields: (keyof FieldErrors)[] = [
        "name", "city", "country", "address", "venue_details", "latitude", "longitude",
        "contact_phone", "whatsapp_number",
      ];
      const extracted: FieldErrors = {};
      fields.forEach((field) => {
        const val = responseData?.[field];
        if (Array.isArray(val) && val[0]) extracted[field] = val[0];
      });

      if (Object.keys(extracted).length) {
        setFieldErrors(extracted);
        return { location: null, fieldErrors: extracted, error: null };
      }

      const generalError =
        responseData?.detail ??
        responseData?.message ??
        "Failed to create location. Please try again.";
      setError(generalError);
      return { location: null, fieldErrors: {}, error: generalError };
    } finally {
      setLoading(false);
    }
  };

  return { createLocation, loading, error, fieldErrors };
};

export default useCreateLocation;
