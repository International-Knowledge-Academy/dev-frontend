// @ts-nocheck
import { motion } from "framer-motion";

import Navbar from "components/home/Navbar";
import Footer from "components/home/Footer";
import CategoriesHero from "components/categories/CategoriesHero";
import CategoryCard from "components/categories/CategoryCard";
import useCategories from "hooks/categories/useCategories";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const cardItem = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const CategoriesHubPage = () => {
  const { categories, loading, error } = useCategories();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <CategoriesHero />

      <div className="flex-1 max-w-6xl mx-auto w-full px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-extrabold text-navy-800 mb-3">
            Our Training Categories
          </h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            Explore our specialized categories and discover programs tailored to your professional goals.
          </p>
        </motion.div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse">
                <div className="w-11 h-11 bg-gray-100 rounded-xl mb-4" />
                <div className="h-5 bg-gray-100 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center py-16 text-red-400">{error}</div>
        )}

        {/* Empty */}
        {!loading && !error && categories.length === 0 && (
          <div className="text-center py-20 text-gray-400">No categories available yet.</div>
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
              <motion.div key={cat.uid} variants={cardItem}>
                <CategoryCard category={cat} />
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
