// @ts-nocheck
import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import Navbar from "components/home/Navbar";
import Footer from "components/home/Footer";
import TrainingHero from "components/training/TrainingHero";
import CategoryTabs from "components/training/CategoryTabs";
import FilterBar from "components/training/FilterBar";
import CourseCard from "components/training/CourseCard";

import useCategories from "hooks/categories/useCategories";
import useLocations from "hooks/locations/useLocations";
import useCourses from "hooks/courses/useCourses";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const cardItem = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const TrainingPage = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") ?? "";

  const [selectedCategoryUid, setSelectedCategoryUid] = useState<string | null>(initialCategory || null);
  const [search, setSearch]             = useState("");
  const [locationUid, setLocationUid]   = useState("");
  const [filterCategory, setFilterCategory] = useState(initialCategory);

  // Data
  const { categories } = useCategories({ is_active: true, ordering: "display_order", type: "training" });
  const { locations }  = useLocations({ is_active: true });
  const { courses, count, loading, error, setParams } = useCourses({
    is_active: true,
    ...(initialCategory && { category: initialCategory }),
  });

  // Resolve selected category object for hero
  const selectedCategory = useMemo(
    () => categories.find((c) => c.uid === selectedCategoryUid) ?? null,
    [categories, selectedCategoryUid]
  );

  // When a tab is clicked — update both hero category and filter
  const handleTabSelect = (uid: string | null) => {
    setSelectedCategoryUid(uid);
    setFilterCategory(uid ?? "");
    setParams({ category: uid ?? "", location: locationUid, search });
  };

  const handleSearchChange = (v: string) => {
    setSearch(v);
    setParams({ search: v, category: filterCategory, location: locationUid });
  };

  const handleLocationChange = (v: string) => {
    setLocationUid(v);
    setParams({ location: v, category: filterCategory, search });
  };

  const handleCategoryFilterChange = (v: string) => {
    setFilterCategory(v);
    setSelectedCategoryUid(v || null);
    setParams({ category: v, location: locationUid, search });
  };

  const clearAll = () => {
    setSearch("");
    setLocationUid("");
    setFilterCategory("");
    setSelectedCategoryUid(null);
    setParams({ search: "", category: "", location: "" });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Hero */}
      <div className="">
        <TrainingHero selectedCategory={selectedCategory} />
      </div>

      {/* Category tabs */}
      <CategoryTabs
        categories={categories}
        selected={selectedCategoryUid}
        onSelect={handleTabSelect}
      />

      {/* Main content */}
      <div className="flex-1 max-w-6xl mx-auto w-full px-6 py-12">

        {/* Filter bar */}
        <div className="mb-8">
          <FilterBar
            search={search}
            onSearchChange={handleSearchChange}
            locationUid={locationUid}
            onLocationChange={handleLocationChange}
            categoryUid={filterCategory}
            onCategoryChange={handleCategoryFilterChange}
            locations={locations}
            categories={categories}
            totalResults={count}
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse"
              >
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
        {!loading && !error && courses.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-16 h-16 rounded-2xl bg-navy-50 text-navy-300 flex items-center justify-center mx-auto mb-4 text-3xl">
              📚
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

        {/* Course grid */}
        {!loading && !error && courses.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${filterCategory}-${locationUid}-${search}`}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              animate="visible"
              variants={container}
            >
              {courses.map((course) => (
                <motion.div key={course.uid} variants={cardItem}>
                  <CourseCard course={course} />
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

export default TrainingPage;
