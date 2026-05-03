// @ts-nocheck
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "components/home/Navbar";
import Footer from "components/home/Footer";
import CategoriesHero from "components/categories/CategoriesHero";
import CategoryCard from "components/categories/CategoryCard";
import useCategories from "hooks/categories/useCategories";

/* ─── Animation variants ─────────────────────────────────────────────────── */

const container = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariant = {
  hidden:  { opacity: 0, y: 22, scale: 0.97 },
  visible: { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.45, ease: "easeOut" } },
};

/* ─── Skeleton card ──────────────────────────────────────────────────────── */

const SkeletonCard = () => (
  <div className="relative rounded-2xl bg-white border border-slate-100 p-6 overflow-hidden animate-pulse">
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-slate-50/80 to-transparent" />
    <div className="w-12 h-12 rounded-xl bg-slate-100 mb-5" />
    <div className="h-5 w-3/4 rounded-lg bg-slate-100 mb-3" />
    <div className="h-3.5 w-full  rounded bg-slate-100 mb-2" />
    <div className="h-3.5 w-5/6  rounded bg-slate-100 mb-2" />
    <div className="h-3.5 w-4/6  rounded bg-slate-100 mb-6" />
    <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
      <div className="h-3 w-12 rounded bg-slate-100" />
      <div className="h-3 w-3  rounded bg-slate-100" />
    </div>
  </div>
);

/* ─── Page ───────────────────────────────────────────────────────────────── */

const CategoriesHubPage = () => {
  const navigate = useNavigate();
  const { categories, loading, error } = useCategories();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <CategoriesHero />

      <div className="flex-1 max-w-6xl mx-auto w-full px-6 py-16">

        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2 className="text-3xl font-extrabold text-navy-800 mb-3">
            Our Training Categories
          </h2>
          <p className="text-slate-500 text-sm max-w-xl mx-auto">
            Explore our specialized categories and discover programs tailored to your professional goals.
          </p>
        </motion.div>

        {/* Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex items-center justify-center p-8 bg-red-50 border border-red-200 rounded-2xl">
            <p className="text-red-500 text-sm text-center">{error}</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && categories.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-100 rounded-2xl gap-3">
            <p className="text-slate-400 text-sm">No categories available yet.</p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && categories.length > 0 && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={container}
          >
            {categories.map((cat) => (
              <motion.div key={cat.uid} variants={cardVariant}>
                <CategoryCard
                  category={cat}
                  onCardClick={() => navigate(`/category/${cat.uid}`)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

      </div>

      <Footer />
    </div>
  );
};

export default CategoriesHubPage;
