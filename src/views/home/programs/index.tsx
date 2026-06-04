// @ts-nocheck
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, ChevronLeft, ChevronRight } from "lucide-react";

import Navbar from "components/home/Navbar";
import Footer from "components/home/Footer";
import ProgramsHero from "components/programs/ProgramsHero";
import TypeTabs from "components/programs/TypeTabs";
import ProgramCard from "components/programs/ProgramCard";
import SearchableDropdown from "components/form/search/SearchableDropdown";
import SearchInput from "components/form/SearchInput";

import usePrograms from "hooks/programs/usePrograms";
import useAllLocations from "hooks/locations/useAllLocations";
import useFields from "hooks/fields/useFields";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const cardItem = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

/* ── Skeleton card matches the new image-top card design ─────────────────── */
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
    <div className="h-40 bg-slate-100" />
    <div className="p-5">
      <div className="h-4 bg-slate-100 rounded w-3/4 mb-2" />
      <div className="h-3 bg-slate-100 rounded w-full mb-1.5" />
      <div className="h-3 bg-slate-100 rounded w-5/6 mb-5" />
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="h-3 bg-slate-100 rounded" />
        <div className="h-3 bg-slate-100 rounded" />
        <div className="h-3 bg-slate-100 rounded" />
        <div className="h-3 bg-slate-100 rounded" />
      </div>
      <div className="h-px bg-slate-100 mb-4" />
      <div className="flex items-center justify-between">
        <div className="h-4 bg-slate-100 rounded w-20" />
        <div className="h-8 bg-slate-100 rounded-full w-24" />
      </div>
    </div>
  </div>
);

const ProgramsPublicPage = () => {
  const [searchParams] = useSearchParams();
  const initialField    = searchParams.get("field")    ?? "";
  const initialCategory = searchParams.get("category") ?? "";

  const [selectedType, setSelectedType]   = useState<string | null>(null);
  const [search, setSearch]               = useState("");
  const [locationUid, setLocationUid]     = useState("");
  const [fieldUid, setFieldUid]           = useState(initialField);
  const [categoryUid, setCategoryUid]     = useState(initialCategory);
  const [filtersOpen, setFiltersOpen]     = useState(false);

  /* ── Data hooks ──────────────────────────────────────────────────────── */
  // useAllLocations fetches all pages so dropdown shows every location
  const { locations } = useAllLocations();
  // page_size=100 ensures we get all fields in one request
  const { fields }    = useFields({ page_size: 100 } as any);

  const locationOptions = [
    { value: "", label: "All Locations" },
    ...locations.map((l) => ({ value: l.uid, label: `${l.name} — ${l.city}` })),
  ];

  const fieldOptions = [
    { value: "", label: "All Fields" },
    ...fields.map((f) => ({ value: f.uid, label: f.name })),
  ];

  const { programs, count, loading, error, params, setParams } = usePrograms({
    is_active: true,
    ...(initialField    && { field:    initialField    }),
    ...(initialCategory && { category: initialCategory }),
  });

  const currentPage = params.page ?? 1;
  // Back-derive page size from first page results; fall back to 10 (Django default)
  const pageSize   = currentPage === 1 && programs.length > 0 ? programs.length : 10;
  const totalPages = count > 0 ? Math.ceil(count / pageSize) : 0;

  /* ── Filter handlers ─────────────────────────────────────────────────── */
  // search: SearchInput already debounces, so just update params directly
  const handleSearchChange = (v: string) => {
    setSearch(v);
    setParams({ search: v || undefined, program_type: selectedType ?? undefined, location: locationUid || undefined, field: fieldUid || undefined, is_active: true });
  };

  const handleTypeSelect = (type: string | null) => {
    setSelectedType(type);
    setParams({ program_type: type ?? undefined, location: locationUid || undefined, field: fieldUid || undefined, search: search || undefined, is_active: true, page: 1 });
  };

  const handleLocationChange = (v: string) => {
    setLocationUid(v);
    setParams({ location: v || undefined, program_type: selectedType ?? undefined, field: fieldUid || undefined, search: search || undefined, is_active: true, page: 1 });
  };

  const handleFieldChange = (v: string) => {
    setFieldUid(v);
    setParams({ field: v || undefined, program_type: selectedType ?? undefined, location: locationUid || undefined, search: search || undefined, is_active: true, page: 1 });
  };

  const clearAll = () => {
    setSearch("");
    setLocationUid("");
    setFieldUid("");
    setCategoryUid("");
    setSelectedType(null);
    setFiltersOpen(false);
    setParams({ search: undefined, program_type: undefined, location: undefined, field: undefined, category: undefined, is_active: true, page: 1 });
  };

  const activeFilterCount = [!!search, !!locationUid, !!fieldUid, !!categoryUid, !!selectedType].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <ProgramsHero selectedType={selectedType} />

      <TypeTabs
        selected={selectedType}
        counts={{}}
        total={count}
        onSelect={handleTypeSelect}
      />

      <div className="flex-1 max-w-6xl mx-auto w-full px-6 py-12">

        {/* ── Filter bar ───────────────────────────────────────────────── */}
        <div className="bg-white border border-slate-100 rounded-xl px-4 py-3 mb-8">

          {/* Row 1 */}
          <div className="flex items-center gap-2">
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

            {/* SearchInput has built-in 400ms debounce */}
            <SearchInput
              value={search}
              onChange={handleSearchChange}
              placeholder="Search programs..."
              className="flex-1 max-w-sm"
            />

            <div className="hidden sm:block w-px h-5 bg-slate-200" />

            {!loading && (
              <span className="hidden sm:block text-xs text-slate-400 whitespace-nowrap flex-shrink-0">
                {count} program{count !== 1 ? "s" : ""}
              </span>
            )}

            {(search || locationUid || fieldUid || selectedType) && (
              <button
                type="button"
                onClick={clearAll}
                className="hidden sm:flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition whitespace-nowrap flex-shrink-0"
              >
                <X size={12} />
                Clear all
              </button>
            )}

            {/* Mobile filter toggle */}
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

          {/* Row 2 — desktop dropdowns */}
          <div className="hidden sm:flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-slate-100">
            <div className="min-w-[200px]">
              <SearchableDropdown
                field="field"
                options={fieldOptions}
                formData={{ field: fieldUid }}
                errors={{}}
                updateFormData={(_, v) => handleFieldChange(v)}
                placeholder="All Fields"
                required={false}
              />
            </div>
            <div className="min-w-[240px]">
              <SearchableDropdown
                field="location"
                options={locationOptions}
                formData={{ location: locationUid }}
                errors={{}}
                updateFormData={(_, v) => handleLocationChange(v)}
                placeholder="All Locations"
                required={false}
              />
            </div>
          </div>

          {/* Mobile expanded filters */}
          {filtersOpen && (
            <div className="sm:hidden mt-2 pt-2 border-t border-slate-100 flex flex-col gap-2">
              <SearchableDropdown
                field="field"
                options={fieldOptions}
                formData={{ field: fieldUid }}
                errors={{}}
                updateFormData={(_, v) => handleFieldChange(v)}
                placeholder="All Fields"
                required={false}
              />
              <SearchableDropdown
                field="location"
                options={locationOptions}
                formData={{ location: locationUid }}
                errors={{}}
                updateFormData={(_, v) => handleLocationChange(v)}
                placeholder="All Locations"
                required={false}
              />
              <div className="flex items-center justify-between">
                {(search || locationUid || fieldUid) && (
                  <button type="button" onClick={clearAll} className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition">
                    <X size={12} /> Clear all
                  </button>
                )}
                {!loading && (
                  <span className="text-xs text-slate-400 ml-auto">
                    {count} program{count !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Loading ──────────────────────────────────────────────────── */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* ── Error ────────────────────────────────────────────────────── */}
        {!loading && error && (
          <div className="text-center py-16 text-red-400 text-sm">{error}</div>
        )}

        {/* ── Empty ────────────────────────────────────────────────────── */}
        {!loading && !error && programs.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-16 h-16 rounded-2xl bg-navy-50 text-navy-300 flex items-center justify-center mx-auto mb-4 text-3xl">
              🎓
            </div>
            <h3 className="text-navy-800 font-bold text-lg mb-2">No programs found</h3>
            <p className="text-slate-400 text-sm max-w-xs mx-auto mb-5">
              Try adjusting your filters or clearing them to see all available programs.
            </p>
            <button
              type="button"
              onClick={clearAll}
              className="text-sm font-semibold text-gold-600 hover:text-gold-700 underline underline-offset-2 transition"
            >
              Clear all filters
            </button>
          </motion.div>
        )}

        {/* ── Programs grid ────────────────────────────────────────────── */}
        {!loading && !error && programs.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedType}-${locationUid}-${fieldUid}-${search}-${currentPage}`}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              animate="visible"
              variants={container}
            >
              {programs.map((program) => (
                <motion.div key={program.uid} variants={cardItem}>
                  <ProgramCard program={program} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* ── Pagination ───────────────────────────────────────────────── */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-400">
              Page <span className="font-semibold text-slate-600">{currentPage}</span> of{" "}
              <span className="font-semibold text-slate-600">{totalPages}</span>
              <span className="hidden sm:inline">
                {" "}— {count} program{count !== 1 ? "s" : ""} total
              </span>
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setParams({ page: currentPage - 1 })}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full border border-slate-200 text-navy-700 hover:border-navy-300 hover:bg-navy-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft size={13} />
                Previous
              </button>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setParams({ page: currentPage + 1 })}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full border border-slate-200 text-navy-700 hover:border-navy-300 hover:bg-navy-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Next
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}

      </div>

      <Footer />
    </div>
  );
};

export default ProgramsPublicPage;
