// @ts-nocheck
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, Loader2 } from "lucide-react";

import Navbar from "components/home/Navbar";
import Footer from "components/home/Footer";
import ProgramsHero from "components/programs/ProgramsHero";
import TypeTabs from "components/programs/TypeTabs";
import ProgramCard from "components/programs/ProgramCard";
import SearchableDropdown from "components/form/search/SearchableDropdown";
import SearchInput from "components/form/SearchInput";
import Services    from "components/home/Services";

import usePrograms from "hooks/programs/usePrograms";
import EmptyState from "components/empty/empty";
import { useAppData } from "context/AppDataContext";

const PAGE_SIZE = 12;

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const cardItem = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

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

  /* ── Filter state ────────────────────────────────────────────────────── */
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [search, setSearch]             = useState("");
  const [locationUid, setLocationUid]   = useState("");
  const [fieldUid, setFieldUid]         = useState(initialField);
  const [categoryUid, setCategoryUid]   = useState(initialCategory);
  const [filtersOpen, setFiltersOpen]   = useState(false);

  /* ── Shared data from context (fetched once on app boot) ─────────────── */
  const { fields, locations } = useAppData();

  const locationOptions = [
    { value: "", label: "All Locations" },
    ...locations.map((l) => ({ value: l.uid, label: `${l.name} — ${l.city}` })),
  ];

  const fieldOptions = [
    { value: "", label: "All Fields" },
    ...fields.map((f) => ({ value: f.uid, label: f.name })),
  ];

  /* ── Programs hook ───────────────────────────────────────────────────── */
  const { programs, count, next, loading, error, params, setParams } = usePrograms({
    is_active: true,
    page_size: PAGE_SIZE,
    ...(initialField    && { field:    initialField    }),
    ...(initialCategory && { category: initialCategory }),
  });

  /* ── Accumulated list for Load More ─────────────────────────────────── */
  const [accumulated, setAccumulated] = useState<typeof programs>([]);
  const prevPageRef = useRef(1);

  useEffect(() => {
    if (loading) return;
    const currentPage = params.page ?? 1;
    if (currentPage === 1) {
      setAccumulated(programs);
    } else if (currentPage > prevPageRef.current) {
      setAccumulated((prev) => {
        const seen = new Set(prev.map((p) => p.uid));
        return [...prev, ...programs.filter((p) => !seen.has(p.uid))];
      });
    }
    prevPageRef.current = currentPage;
  }, [programs, loading]); // eslint-disable-line react-hooks/exhaustive-deps

  const hasMore = !!next;

  /* ── Filter helpers ──────────────────────────────────────────────────── */
  const resetToPage1 = (overrides: object) => {
    prevPageRef.current = 0; // force replace on next effect
    setAccumulated([]);
    setParams({ search: search || undefined, program_type: selectedType ?? undefined, location: locationUid || undefined, field: fieldUid || undefined, category: categoryUid || undefined, is_active: true, page: 1, page_size: PAGE_SIZE, ...overrides });
  };

  const handleSearchChange = (v: string) => {
    setSearch(v);
    resetToPage1({ search: v || undefined });
  };

  const handleTypeSelect = (type: string | null) => {
    setSelectedType(type);
    resetToPage1({ program_type: type ?? undefined });
  };

  const handleLocationChange = (v: string) => {
    setLocationUid(v);
    resetToPage1({ location: v || undefined });
  };

  const handleFieldChange = (v: string) => {
    setFieldUid(v);
    resetToPage1({ field: v || undefined });
  };

  const clearAll = () => {
    setSearch(""); setLocationUid(""); setFieldUid(""); setCategoryUid(""); setSelectedType(null); setFiltersOpen(false);
    prevPageRef.current = 0;
    setAccumulated([]);
    setParams({ search: undefined, program_type: undefined, location: undefined, field: undefined, category: undefined, is_active: true, page: 1, page_size: PAGE_SIZE });
  };

  const handleLoadMore = () => {
    setParams({ page: (params.page ?? 1) + 1 });
  };

  const activeFilterCount = [!!search, !!locationUid, !!fieldUid, !!categoryUid, !!selectedType].filter(Boolean).length;
  const isInitialLoad = loading && accumulated.length === 0;

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

        {/* ── Filter bar ─────────────────────────────────────────────── */}
        <div className="bg-white border border-slate-100 rounded-xl px-4 py-3 mb-8">

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

            <SearchInput
              value={search}
              onChange={handleSearchChange}
              placeholder="Search programs..."
              className="flex-1 max-w-sm"
            />

            <div className="hidden sm:block w-px h-5 bg-slate-200" />

            {!isInitialLoad && (
              <span className="hidden sm:block text-xs text-slate-400 whitespace-nowrap flex-shrink-0">
                {accumulated.length} / {count} program{count !== 1 ? "s" : ""}
              </span>
            )}

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="hidden sm:flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition whitespace-nowrap flex-shrink-0"
              >
                <X size={12} />
                Clear all
              </button>
            )}

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

          {/* Desktop dropdowns */}
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
                {activeFilterCount > 0 && (
                  <button type="button" onClick={clearAll} className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition">
                    <X size={12} /> Clear all
                  </button>
                )}
                {!isInitialLoad && (
                  <span className="text-xs text-slate-400 ml-auto">
                    {accumulated.length} / {count} program{count !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Initial skeleton ───────────────────────────────────────── */}
        {isInitialLoad && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* ── Error ──────────────────────────────────────────────────── */}
        {!loading && error && (
          <div className="text-center py-16 text-red-400 text-sm">{error}</div>
        )}

        {/* ── Empty ──────────────────────────────────────────────────── */}
        {!isInitialLoad && !error && accumulated.length === 0 && (
          <EmptyState
            title="No programs found"
            description="Try adjusting your filters or clearing them to see all available programs."
            actionButton={
              <button
                type="button"
                onClick={clearAll}
                className="text-sm font-semibold text-gold-600 hover:text-gold-700 underline underline-offset-2 transition"
              >
                Clear all filters
              </button>
            }
          />
        )}

        {/* ── Programs grid ──────────────────────────────────────────── */}
        {!isInitialLoad && !error && accumulated.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedType}-${locationUid}-${fieldUid}-${search}`}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              animate="visible"
              variants={container}
            >
              {accumulated.map((program) => (
                <motion.div key={program.uid} variants={cardItem}>
                  <ProgramCard program={program} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* ── Load More ──────────────────────────────────────────────── */}
        {!isInitialLoad && !error && (hasMore || (loading && accumulated.length > 0)) && (
          <div className="flex flex-col items-center mt-10 gap-3">
            <p className="text-xs text-slate-400">
              Showing <span className="font-semibold text-slate-600">{accumulated.length}</span> of{" "}
              <span className="font-semibold text-slate-600">{count}</span> programs
            </p>
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={loading}
              className="inline-flex items-center gap-2 px-8 py-2.5 rounded-md lg:rounded-lg bg-navy-700 hover:bg-navy-800 text-white text-sm font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Loading…
                </>
              ) : (
                "Load More"
              )}
            </button>
          </div>
        )}

      </div>

        <Services />

      <Footer />

    </div>
  );
};

export default ProgramsPublicPage;
