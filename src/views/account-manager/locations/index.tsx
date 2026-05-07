// @ts-nocheck
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin, Globe, GraduationCap,
  Plus, RefreshCw, Pencil, Trash2, AlertTriangle,
  X, Filter, ToggleLeft, Building2,
} from "lucide-react";
import useLocations from "hooks/locations/useLocations";
import useDeleteLocation from "hooks/locations/useDeleteLocation";
import { useToast } from "context/ToastContext";
import { COUNTRIES } from "constants/lists";
import Loading from "components/loading/Loading";
import Button from "components/ui/buttons/Button";
import IconButton from "components/ui/buttons/IconButton";
import PageHeader from "components/ui/PageHeader";
import PrevButton from "components/ui/buttons/PrevButton";
import NextButton from "components/ui/buttons/NextButton";
import SearchInput from "components/form/SearchInput";
import FilterSelectField from "components/form/filter/FilterSelectField";
import SearchableDropdown from "components/form/search/SearchableDropdown";
import ConfirmModal from "components/ui/modals/ConfirmModal";
import EmptyState from "components/empty/empty";
import type { Location } from "types/location";

const COUNTRY_OPTIONS = [
  { value: "", label: "All Countries" },
  ...COUNTRIES.map((c) => ({ value: c.name, label: c.name })),
];

/* ─── Stat card ─────────────────────────────────────────────────────────── */

const StatCard = ({
  icon: Icon,
  label,
  value,
  accent = false,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  accent?: boolean;
}) => (
  <div className="flex items-center gap-4 bg-white border border-slate-100 rounded-xl px-5 py-4 shadow-sm flex-1 min-w-0">
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${accent ? "bg-gold-50 border border-gold-200" : "bg-navy-50 border border-navy-100"}`}>
      <Icon size={18} className={accent ? "text-gold-500" : "text-navy-600"} />
    </div>
    <div className="min-w-0">
      <p className={`text-2xl font-extrabold tabular-nums leading-none ${accent ? "text-gold-500" : "text-navy-800"}`}>
        {value}
      </p>
      <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-medium">{label}</p>
    </div>
  </div>
);

/* ─── Main page ─────────────────────────────────────────────────────────── */

const LocationsPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { locations, count, loading, error, params, setParams, refetch } = useLocations();
  const { deleteLocation, loading: deleting } = useDeleteLocation();

  const [deleteTarget, setDeleteTarget] = useState<Location | null>(null);
  const [cityInput, setCityInput]       = useState(params.city ?? "");
  const [filtersOpen, setFiltersOpen]   = useState(false);

  // Debounce city text input → server param
  useEffect(() => {
    const t = setTimeout(() => setParams({ city: cityInput || undefined }), 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityInput]);

  const totalCourses    = locations.reduce((s, l) => s + (l.course_count ?? 0), 0);
  const uniqueCountries = new Set(locations.map((l) => l.country)).size;

  const activeFilterCount = [
    params.is_active !== undefined,
    !!params.country,
    !!params.city,
  ].filter(Boolean).length;

  const hasAnyFilter = activeFilterCount > 0 || !!params.search;

  const clearAllFilters = () => {
    setCityInput("");
    setParams({ is_active: undefined, country: undefined, city: undefined, search: undefined });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const ok = await deleteLocation(deleteTarget.uid);
    if (ok) {
      addToast("Location deleted successfully", "success");
      setDeleteTarget(null);
      refetch();
    }
  };

  const totalPages = Math.ceil(count / 10);

  return (
    <>
      {/* Page header */}
      <PageHeader
        title="Training Locations"
        subtitle="Manage your global training centers"
        actions={
          <Button
            variant="dark-navy"
            text="Add Location"
            icon={<Plus size={15} />}
            onClick={() => navigate("/admin/locations/create")}
          />
        }
        className="mb-4 px-0 sm:px-0"
      />

      {/* Stats */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <StatCard icon={MapPin}        label="Total Locations" value={count}           />
        <StatCard icon={GraduationCap} label="Programs"        value={totalCourses}    accent />
        <StatCard icon={Globe}         label="Countries"       value={uniqueCountries} />
      </div>

      {/* Filter bar */}
      <div className="bg-white border border-slate-100 rounded-xl px-4 py-3 mb-4">

        {/* Main row — always visible */}
        <div className="flex items-center gap-2">

          {/* Desktop: label + badge */}
          <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
            <Filter size={15} className="text-slate-400" />
            <span className="text-sm font-semibold text-slate-600">Filters</span>
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-navy-700 text-white text-[10px] font-bold">
                {activeFilterCount}
              </span>
            )}
          </div>

          <div className="hidden sm:block w-px h-5 bg-slate-200" />

          {/* Search — always visible */}
          <SearchInput
            value={params.search ?? ""}
            onChange={(val) => setParams({ search: val })}
            placeholder="Search locations..."
            className="flex-1 max-w-xs"
          />

          {/* Desktop: status */}
          <div className="hidden sm:block">
            <FilterSelectField
              value={params.is_active === undefined ? "all" : String(params.is_active)}
              onChange={(val) =>
                setParams({ is_active: val === "all" ? undefined : val === "true" })
              }
              icon={ToggleLeft}
              defaultOption="All Status"
              options={[
                { value: "true",  label: "Active"   },
                { value: "false", label: "Inactive" },
              ]}
            />
          </div>

          <div className="hidden sm:block w-px h-5 bg-slate-200" />

          {/* Desktop: refresh */}
          <IconButton
            onClick={refetch}
            icon={<RefreshCw size={15} />}
            bgColor="bg-white"
            textColor="text-slate-500"
            borderColor="border-slate-200"
            hoverTextColor="hover:text-slate-700"
            hoverBorderColor="hover:border-slate-300"
            className="hidden sm:flex p-2 flex-shrink-0"
          />

          {/* Desktop: clear all */}
          {hasAnyFilter && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="hidden sm:flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition whitespace-nowrap flex-shrink-0"
            >
              <X size={12} />
              Clear all
            </button>
          )}

          {/* Desktop: spacer + showing */}
          <div className="flex-1 hidden sm:block" />
          {!loading && (
            <span className="hidden sm:block text-xs text-slate-400 whitespace-nowrap flex-shrink-0">
              Showing{" "}
              <span className="font-semibold text-slate-600">{locations.length}</span>
              {" "}of{" "}
              <span className="font-semibold text-slate-600">{count}</span>
            </span>
          )}

          {/* Mobile: filter toggle button */}
          <button
            type="button"
            onClick={() => setFiltersOpen((o) => !o)}
            className="relative sm:hidden flex-shrink-0 p-2 rounded-md border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 transition"
          >
            <Filter size={16} />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-navy-700 text-white text-[9px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile: expanded filter panel */}
        {filtersOpen && (
          <div className="sm:hidden mt-2 pt-2 border-t border-slate-100 flex flex-col gap-2">
            <FilterSelectField
              value={params.is_active === undefined ? "all" : String(params.is_active)}
              onChange={(val) =>
                setParams({ is_active: val === "all" ? undefined : val === "true" })
              }
              icon={ToggleLeft}
              defaultOption="All Status"
              options={[
                { value: "true",  label: "Active"   },
                { value: "false", label: "Inactive" },
              ]}
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconButton
                  onClick={refetch}
                  icon={<RefreshCw size={14} />}
                  bgColor="bg-white"
                  textColor="text-slate-500"
                  borderColor="border-slate-200"
                  hoverTextColor="hover:text-slate-700"
                  hoverBorderColor="hover:border-slate-300"
                  className="p-2"
                />
                {hasAnyFilter && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition"
                  >
                    <X size={12} />
                    Clear all
                  </button>
                )}
              </div>
              {!loading && (
                <span className="text-xs text-slate-400">
                  Showing{" "}
                  <span className="font-semibold text-slate-600">{locations.length}</span>
                  {" "}of{" "}
                  <span className="font-semibold text-slate-600">{count}</span>
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-slate-100">
        <div className="p-4 sm:p-6">
          <div className="rounded-xl border border-slate-100 overflow-hidden">
            {loading ? (
              <Loading text="Fetching locations data..." />
            ) : error ? (
              <div className="flex items-center justify-center py-16 text-sm text-red-500">{error}</div>
            ) : locations.length === 0 ? (
              <EmptyState
                icon={<MapPin />}
                title="No locations found"
                description="No locations match your search or filters. Try adjusting them or add a new location."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/60">
                      {[
                        { label: "Location", icon: <MapPin        size={13} /> },
                        { label: "City",     icon: <Building2     size={13} /> },
                        { label: "Country",  icon: <Globe         size={13} /> },
                        { label: "Programs", icon: <GraduationCap size={13} /> },
                        { label: "Status",   icon: <ToggleLeft    size={13} /> },
                        { label: "Actions",  icon: null },
                      ].map(({ label, icon }) => (
                        <th
                          key={label}
                          className="px-5 py-3 text-left text-xs font-bold tracking-widest uppercase text-slate-400"
                        >
                          <span className="flex items-center gap-1.5">{icon}{label}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {locations.map((location) => (
                      <tr
                        key={location.uid}
                        onClick={() => navigate(`/admin/locations/${location.uid}`)}
                        className="hover:bg-slate-50 transition cursor-pointer group"
                      >
                        {/* Location */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-navy-50 border border-navy-100 flex items-center justify-center text-navy-600 font-bold text-xs flex-shrink-0 group-hover:bg-navy-100 transition-colors">
                              {location.name?.[0]?.toUpperCase() ?? "?"}
                            </div>
                            <span className="font-semibold text-navy-800 truncate" title={location.name}>
                              {location.name}
                            </span>
                          </div>
                        </td>

                        {/* City */}
                        <td className="px-5 py-3.5 text-slate-500">{location.city}</td>

                        {/* Country */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <Globe size={12} className="text-slate-300 flex-shrink-0" />
                            <span>{location.country}</span>
                          </div>
                        </td>

                        {/* Programs */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <GraduationCap size={13} className="text-gold-400 flex-shrink-0" />
                            <span className="font-semibold text-navy-700 tabular-nums">
                              {location.course_count ?? 0}
                            </span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${
                            location.is_active
                              ? "bg-green-50 text-green-600 border-green-200"
                              : "bg-slate-50 text-slate-400 border-slate-200"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${location.is_active ? "bg-green-500" : "bg-slate-300"}`} />
                            {location.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => navigate(`/admin/locations/${location.uid}/edit`)}
                              className="p-1.5 rounded-md text-slate-400 hover:bg-navy-50 hover:text-navy-700 transition"
                              title="Edit"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(location)}
                              className="p-1.5 rounded-md text-slate-400 hover:bg-red-50 hover:text-red-500 transition"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-t border-slate-100">
                <p className="text-xs text-slate-400">
                  Page {params.page ?? 1} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <PrevButton
                    text="Previous"
                    disabled={!params.page || params.page <= 1}
                    onClick={() => setParams({ page: (params.page ?? 1) - 1 })}
                  />
                  <NextButton
                    text="Next"
                    disabled={(params.page ?? 1) >= totalPages}
                    onClick={() => setParams({ page: (params.page ?? 1) + 1 })}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Location"
        message={
          <>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-navy-800">{deleteTarget?.name}</span>?
            {" "}This action cannot be undone.
          </>
        }
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleting}
        icon={<AlertTriangle size={20} className="text-red-500" />}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default LocationsPage;
