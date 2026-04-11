// @ts-nocheck
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Navbar from "components/home/Navbar";
import Footer from "components/home/Footer";
import ProgramsHero from "components/programs/ProgramsHero";
import TypeTabs from "components/programs/TypeTabs";
import ProgramCard from "components/programs/ProgramCard";

import usePrograms from "hooks/programs/usePrograms";
import useLocations from "hooks/locations/useLocations";
import useCategories from "hooks/categories/useCategories";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const cardItem = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const ProgramsPublicPage = () => {
  const [selectedType, setSelectedType]   = useState<string | null>(null);
  const [search, setSearch]               = useState("");
  const [locationUid, setLocationUid]     = useState("");
  const [categoryUid, setCategoryUid]     = useState("");

  const { locations }   = useLocations({ is_active: true });
  const { categories }  = useCategories({ is_active: true, ordering: "display_order", type: "international_youth" });

  const { programs, count, loading, error, setParams } = usePrograms({ is_active: true });

  // Counts per type (approximate from total when not filtered)
  const typeCounts: Record<string, number> = {};

  const handleTypeSelect = (type: string | null) => {
    setSelectedType(type);
    setParams({ type: type ?? "", location: locationUid, category: categoryUid, search, is_active: true });
  };

  const handleSearchChange = (v: string) => {
    setSearch(v);
    setParams({ search: v, type: selectedType ?? "", location: locationUid, category: categoryUid, is_active: true });
  };

  const handleLocationChange = (v: string) => {
    setLocationUid(v);
    setParams({ location: v, type: selectedType ?? "", category: categoryUid, search, is_active: true });
  };

  const handleCategoryChange = (v: string) => {
    setCategoryUid(v);
    setParams({ category: v, type: selectedType ?? "", location: locationUid, search, is_active: true });
  };

  const clearAll = () => {
    setSearch("");
    setLocationUid("");
    setCategoryUid("");
    setSelectedType(null);
    setParams({ search: "", type: "", location: "", category: "", is_active: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <ProgramsHero selectedType={selectedType} />

      <TypeTabs
        selected={selectedType}
        counts={typeCounts}
        total={count}
        onSelect={handleTypeSelect}
      />

      <div className="flex-1 max-w-6xl mx-auto w-full px-6 py-12">

        {/* Search + Location filter */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search programs..."
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-navy-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-300 transition"
            />
          </div>

          {/* Category select */}
          <select
            value={categoryUid}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-300 transition"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.uid} value={c.uid}>{c.name}</option>
            ))}
          </select>

          {/* Location select */}
          <select
            value={locationUid}
            onChange={(e) => handleLocationChange(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-300 transition"
          >
            <option value="">All Locations</option>
            {locations.map((l) => (
              <option key={l.uid} value={l.uid}>
                {l.name} — {l.city}, {l.country}
              </option>
            ))}
          </select>

          {/* Results + clear */}
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-sm text-gray-400">
              {loading ? "Loading..." : `${count} program${count !== 1 ? "s" : ""}`}
            </span>
            {(search || locationUid || categoryUid || selectedType) && (
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
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-1/3 mb-4" />
                <div className="h-5 bg-gray-100 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-full mb-1" />
                <div className="h-4 bg-gray-100 rounded w-5/6 mb-6" />
                <div className="h-px bg-gray-100 mb-4" />
                <div className="flex gap-4">
                  <div className="h-3 bg-gray-100 rounded w-16" />
                  <div className="h-3 bg-gray-100 rounded w-20" />
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
            <p className="text-gray-400 text-sm max-w-xs mx-auto mb-5">
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
              key={`${selectedType}-${locationUid}-${search}`}
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
