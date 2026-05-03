// @ts-nocheck
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MdSchool, MdPublic, MdMenuBook } from "react-icons/md";

import Navbar from "components/home/Navbar";
import Footer from "components/home/Footer";
import CategoryTypeHero from "components/categories/CategoryTypeHero";
import CategoryCard from "components/categories/CategoryCard";
import useCategories from "hooks/categories/useCategories";
import type { CategoryType } from "types/category";

const TYPE_CONFIG: Record<string, {
  categoryType: CategoryType;
  label: string;
  title: string;
  description: string;
  icon: React.ElementType;
}> = {
  "training-development": {
    categoryType: "training",
    label: "Training Field",
    title: "Training & Development",
    description:
      "Professional development programs designed to enhance leadership, management, and technical skills across public and private sector organizations.",
    icon: MdSchool,
  },
  "international-youth": {
    categoryType: "international_youth",
    label: "Training Field",
    title: "International & Youth Programs",
    description:
      "Global exchange initiatives, youth leadership programs, and international partnerships that empower the next generation of leaders.",
    icon: MdPublic,
  },
  "research": {
    categoryType: "research",
    label: "Training Field",
    title: "Research and Knowledge Services",
    description:
      "Evidence-based research, knowledge management consulting, and organizational development services tailored to institutional needs.",
    icon: MdMenuBook,
  },
};

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const cardItem = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const CategoryTypePage = () => {
  const { typeSlug } = useParams<{ typeSlug: string }>();
  const config = typeSlug ? TYPE_CONFIG[typeSlug] : null;

  const { categories, loading, error } = useCategories(
    config
      ? { type: config.categoryType, is_active: true, ordering: "display_order" }
      : {}
  );

  if (!config) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center flex-col gap-3 pt-24">
          <h1 className="text-3xl font-bold text-navy-700">404</h1>
          <p className="text-slate-500">Category type not found.</p>
          <Link
            to="/categories"
            className="text-gold-600 font-semibold hover:underline text-sm mt-2"
          >
            Back to Categories
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <CategoryTypeHero
        icon={config.icon}
        label={config.label}
        title={config.title}
        description={config.description}
      />

      <div className="flex-1 max-w-6xl mx-auto w-full px-6 py-16">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h2 className="text-2xl font-extrabold text-navy-800 mb-2">
            Sub-Categories
          </h2>
          <p className="text-slate-500 text-sm">
            Browse specialized categories within{" "}
            <span className="font-semibold text-navy-700">{config.title}</span>.
            Click any category to view its available courses.
          </p>
        </motion.div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse"
              >
                <div className="w-11 h-11 bg-slate-100 rounded-xl mb-4" />
                <div className="h-4 bg-slate-100 rounded w-1/3 mb-3" />
                <div className="h-5 bg-slate-100 rounded w-3/4 mb-2" />
                <div className="h-4 bg-slate-100 rounded w-full mb-1" />
                <div className="h-4 bg-slate-100 rounded w-5/6" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center py-16 text-red-400">{error}</div>
        )}

        {/* Empty state */}
        {!loading && !error && categories.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-16 h-16 rounded-2xl bg-navy-50 text-navy-300 flex items-center justify-center mx-auto mb-4 text-3xl">
              📂
            </div>
            <h3 className="text-navy-800 font-bold text-lg mb-2">No categories yet</h3>
            <p className="text-slate-400 text-sm max-w-xs mx-auto">
              Categories for this field will appear here once added.
            </p>
          </motion.div>
        )}

        {/* Category grid */}
        {!loading && !error && categories.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={typeSlug}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              animate="visible"
              variants={container}
            >
              {categories.map((cat) => (
                <motion.div key={cat.uid} variants={cardItem}>
                  <CategoryCard category={cat} />
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

export default CategoryTypePage;
