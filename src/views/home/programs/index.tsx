// @ts-nocheck
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import Navbar from "components/home/Navbar";
import Footer from "components/home/Footer";
import ProgramsHero from "components/programs/ProgramsHero";
import TypeTabs from "components/programs/TypeTabs";
import ProgramCard from "components/programs/ProgramCard";
import SearchableDropdown from "components/form/search/SearchableDropdown";

import usePrograms from "hooks/programs/usePrograms";
import useLocations from "hooks/locations/useLocations";
import useFields from "hooks/fields/useFields";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const cardItem = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const ProgramsPublicPage = () => {
  const [searchParams] = useSearchParams();
  const initialField = searchParams.get("field") ?? "";

  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [search, setSearch]             = useState("");
  const [locationUid, setLocationUid]   = useState("");
  const [fieldUid, setFieldUid]         = useState(initialField);

  const { locations } = useLocations();
  const { fields }    = useFields();

  const locationOptions = [
    { value: "", label: "All Locations" },
    ...locations.map((l) => ({ value: l.uid, label: `${l.name} — ${l.city}, ${l.country}` })),
  ];

  const { programs, count, loading, error, setParams } = usePrograms({
    is_active: true,
    ...(initialField && { field: initialField }),
  });

  const handleTypeSelect = (type: string | null) => {
    setSelectedType(type);
    setParams({ program_type: type ?? undefined, location: locationUid || undefined, field: fieldUid || undefined, search: search || undefined, is_active: true });
  };

  const handleSearchChange = (v: string) => {
    setSearch(v);
    setParams({ search: v || undefined, program_type: selectedType ?? undefined, location: locationUid || undefined, field: fieldUid || undefined, is_active: true });
  };

  const handleLocationChange = (v: string) => {
    setLocationUid(v);
    setParams({ location: v || undefined, program_type: selectedType ?? undefined, field: fieldUid || undefined, search: search || undefined, is_active: true });
  };

  const handleFieldChange = (v: string) => {
    setFieldUid(v);
    setParams({ field: v || undefined, program_type: selectedType ?? undefined, location: locationUid || undefined, search: search || undefined, is_active: true });
  };

  const clearAll = () => {
    setSearch("");
    setLocationUid("");
    setFieldUid("");
    setSelectedType(null);
    setParams({ search: undefined, program_type: undefined, location: undefined, field: undefined, is_active: true });
  };

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

        {/* Search + filters */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search programs..."
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-navy-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-300 transition"
            />
          </div>

          <select
            value={fieldUid}
            onChange={(e) => handleFieldChange(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-300 transition"
          >
            <option value="">All Fields</option>
            {fields.map((f) => (
              <option key={f.uid} value={f.uid}>{f.name}</option>
            ))}
          </select>

          <div className="relative min-w-[220px]">
            <SearchableDropdown
              field="location"
              label="Location"
              options={locationOptions}
              formData={{ location: locationUid }}
              errors={{}}
              updateFormData={(_, v) => handleLocationChange(v)}
              placeholder="All Locations"
              required={false}
            />
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <span className="text-sm text-slate-400">
              {loading ? "Loading..." : `${count} program${count !== 1 ? "s" : ""}`}
            </span>
            {(search || locationUid || fieldUid || selectedType) && (
              <button
                onClick={clearAll}
                className="text-xs font-semibold text-gold-600 hover:text-gold-700 underline underline-offset-2 transition"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse">
                <div className="h-4 bg-slate-100 rounded w-1/3 mb-4" />
                <div className="h-5 bg-slate-100 rounded w-3/4 mb-2" />
                <div className="h-4 bg-slate-100 rounded w-full mb-1" />
                <div className="h-4 bg-slate-100 rounded w-5/6 mb-6" />
                <div className="h-px bg-slate-100 mb-4" />
                <div className="flex gap-4">
                  <div className="h-3 bg-slate-100 rounded w-16" />
                  <div className="h-3 bg-slate-100 rounded w-20" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center py-16 text-red-400">{error}</div>
        )}

        {/* Empty */}
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
              onClick={clearAll}
              className="text-sm font-semibold text-gold-600 hover:text-gold-700 underline underline-offset-2 transition"
            >
              Clear all filters
            </button>
          </motion.div>
        )}

        {/* Programs grid */}
        {!loading && !error && programs.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedType}-${locationUid}-${fieldUid}-${search}`}
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

      </div>

      <Footer />
    </div>
  );
};

export default ProgramsPublicPage;
