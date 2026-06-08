// @ts-nocheck
import { createContext, useContext, ReactNode } from "react";
import useCategories from "hooks/categories/useCategories";
import useFields from "hooks/fields/useFields";
import useAllLocations from "hooks/locations/useAllLocations";
import type { Category } from "types/category";
import type { Field } from "types/field";
import type { Location } from "types/location";

interface AppDataContextType {
  categories: Category[];
  fields: Field[];
  locations: Location[];
  loadingCategories: boolean;
  loadingFields: boolean;
  loadingLocations: boolean;
}

const AppDataContext = createContext<AppDataContextType>({
  categories: [],
  fields: [],
  locations: [],
  loadingCategories: false,
  loadingFields: false,
  loadingLocations: false,
});

export const AppDataProvider = ({ children }: { children: ReactNode }) => {
  const { categories, loading: loadingCategories } = useCategories({
    is_active: true,
    ordering: "display_order",
    page_size: 100,
  });

  const { fields, loading: loadingFields } = useFields({ page_size: 100 } as any);

  const { locations, loading: loadingLocations } = useAllLocations();

  return (
    <AppDataContext.Provider
      value={{ categories, fields, locations, loadingCategories, loadingFields, loadingLocations }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => useContext(AppDataContext);
