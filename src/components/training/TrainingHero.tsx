// @ts-nocheck
import { motion, AnimatePresence } from "framer-motion";
import { MdSchool } from "react-icons/md";
import type { Category } from "types/category";

interface Props {
  selectedCategory: Category | null;
}

const TrainingHero = ({ selectedCategory }: Props) => {
  return (
    <section className="relative bg-navy-600 overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500 opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-400 opacity-10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 py-24 text-center">

        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "backOut" }}
          className="w-16 h-16 rounded-2xl bg-gold-500/20 text-gold-400 flex items-center justify-center mx-auto mb-6"
        >
          <MdSchool size={32} />
        </motion.div>

        {/* Label */}
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-block text-gold-400 font-semibold text-sm uppercase tracking-widest mb-4"
        >
          Training Catalog
        </motion.span>

        {/* Dynamic title */}
        <AnimatePresence mode="wait">
          <motion.h1
            key={selectedCategory?.uid ?? "default"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="text-5xl md:text-6xl font-extrabold text-white leading-tight"
          >
            {selectedCategory ? (
              <>
                <span className="text-gold-400">{selectedCategory.name}</span>
              </>
            ) : (
              <>
                Explore Our{" "}
                <span className="text-gold-400">Training Programs</span>
              </>
            )}
          </motion.h1>
        </AnimatePresence>

        {/* Dynamic description */}
        <AnimatePresence mode="wait">
          <motion.p
            key={(selectedCategory?.uid ?? "default") + "-desc"}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
            className="mt-5 text-lg text-navy-200 max-w-2xl mx-auto leading-relaxed"
          >
            {selectedCategory?.description ||
              "Browse IKA's full catalog of professional training programs across 20+ specialized fields. Filter by category, location, or title to find the right program for you."}
          </motion.p>
        </AnimatePresence>

        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 flex items-center justify-center gap-2 text-sm text-navy-300"
        >
          <span>Home</span>
          <span className="text-gold-500">/</span>
          <span className="text-gold-400 font-medium">
            {selectedCategory ? selectedCategory.name : "Training Programs"}
          </span>
        </motion.div>

      </div>
    </section>
  );
};

export default TrainingHero;
