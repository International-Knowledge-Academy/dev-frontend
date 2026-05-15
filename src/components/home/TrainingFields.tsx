// @ts-nocheck
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BookOpen, ArrowRight, Zap } from "lucide-react";
import useCategories from "hooks/categories/useCategories";
import type { Category } from "types/category";

/* ─── Animation variants ─────────────────────────────────────────────────── */

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, ease: "easeOut", delay },
  }),
};

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
  <div className="relative rounded-2xl bg-slate-100 border border-slate-100 p-6 h-64 overflow-hidden">
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    <div className="w-12 h-12 rounded-xl bg-slate-200 mb-5" />
    <div className="h-5 w-3/4 rounded-lg bg-slate-200 mb-3" />
    <div className="h-3.5 w-full  rounded bg-slate-200 mb-2" />
    <div className="h-3.5 w-5/6  rounded bg-slate-200 mb-2" />
    <div className="h-3.5 w-4/6  rounded bg-slate-200" />
  </div>
);

/* ─── Category card ──────────────────────────────────────────────────────── */

const CategoryCard = ({
  category,
  onCardClick,
}: {
  category: Category;
  onCardClick?: (c: Category) => void;
}) => (
  <motion.article
    variants={cardVariant}
    whileHover={{ y: -5, transition: { duration: 0.2, ease: "easeOut" } }}
    onClick={() => onCardClick?.(category)}
    role={onCardClick ? "button" : undefined}
    tabIndex={onCardClick ? 0 : undefined}
    aria-label={`Training category: ${category.name}`}
    className="group relative bg-white border border-slate-100 hover:border-gold-300 rounded-2xl p-6 flex flex-col cursor-pointer hover:shadow-[0_8px_32px_rgba(201,168,76,0.14)] transition-all duration-300 overflow-hidden"
  >
    {/* ── Animated top border sweep ── */}
    <span
      className="absolute top-0 left-0 h-[2px] rounded-r-full bg-gradient-to-r from-gold-400 via-gold-500 to-gold-300 w-0 group-hover:w-full transition-[width] duration-500 ease-out pointer-events-none"
      aria-hidden="true"
    />

    {/* ── Hover background glow ── */}
    <span
      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 bg-gradient-to-br from-gold-50/60 via-transparent to-transparent transition-opacity duration-500 pointer-events-none"
      aria-hidden="true"
    />

    {/* ── Corner accent dot ── */}
    <span
      className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-gold-400 transition-colors duration-300"
      aria-hidden="true"
    />

    {/* ── Icon ── */}
    <div className="relative w-12 h-12 rounded-xl bg-navy-50 border border-navy-100 group-hover:bg-gold-50 group-hover:border-gold-200 flex items-center justify-center mb-5 flex-shrink-0 transition-all duration-300">
      <BookOpen size={21} className="text-navy-600 group-hover:text-gold-500 transition-colors duration-300" aria-hidden="true" />
    </div>

    {/* ── Title ── */}
    <h3 className="text-navy-800 font-bold text-xl leading-snug mb-2.5 pr-5 line-clamp-2">
      {category.name}
    </h3>

    {/* ── Summary ── */}
    <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 flex-1 mb-5 text-justify">
      {category.summary || "Specialized training program designed for professional development and career advancement."}
    </p>

    {/* ── Footer ── */}
    <div className="flex items-center gap-2 pt-4 border-t border-slate-100 group-hover:border-gold-100 transition-colors duration-300">
      <span className="text-slate-400 group-hover:text-gold-500 text-xs font-bold uppercase tracking-widest transition-colors duration-300">
        Explore
      </span>
      <ArrowRight
        size={13}
        className="text-slate-400 group-hover:text-gold-500 group-hover:translate-x-1 transition-all duration-300"
        aria-hidden="true"
      />
    </div>
  </motion.article>
);

/* ─── Main section ───────────────────────────────────────────────────────── */

const TrainingFields = ({ onCardClick }: { onCardClick?: (c: Category) => void }) => {
  const navigate = useNavigate();
  const { categories, count, loading, error } = useCategories({
    ordering: "display_order",
  });

  const handleCardClick = (cat: Category) => {
    if (onCardClick) onCardClick(cat);
    else navigate(`/category/${cat.uid}`);
  };

  return (
    <section className="relative py-24 px-6 bg-slate-50 overflow-hidden">

      {/* ── Decorative blobs ── */}
      <div className="absolute -top-24 left-1/3  w-[480px] h-[480px] bg-gold-100/40  rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0  right-1/4 w-[360px] h-[360px] bg-navy-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">

        {/* ── Header ── */}
        <div className="text-center mb-16 space-y-5">

          {/* Badge */}
          <motion.div
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            className="flex justify-center"
          >
            <span className="inline-flex items-center gap-2 bg-gold-50 border border-gold-200 text-gold-600 text-[11px] font-bold uppercase tracking-[0.15em] px-4 py-2 rounded-full">
              <Zap size={11} aria-hidden="true" />
              Premium Training
            </span>
          </motion.div>

          {/* Title */}
          <motion.h2
            custom={0.08}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            className="text-3xl md:text-5xl font-extrabold text-navy-800 leading-tight tracking-tight"
          >
            Explore Our{" "}
            <span className="bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 bg-clip-text text-transparent">
              {loading ? "—" : count}{" "}
              {count === 1 ? "Category" : "Categories"}
            </span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            custom={0.16}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            className="text-slate-500 max-w-lg mx-auto text-sm md:text-base leading-relaxed text-justify"
          >
            From leadership and governance to technical and institutional fields — discover
            programs built for professionals, executives, and government employees.

          </motion.p>

          {/* Gold accent line */}
          <motion.div
            custom={0.22}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            className="flex justify-center"
          >
            <div className="w-16 h-[3px] rounded-full bg-gradient-to-r from-gold-400 to-gold-600" />
          </motion.div>
        </div>

        {/* ── Grid / States ── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <div className="flex items-center justify-center p-8 bg-red-50 border border-red-200 rounded-2xl">
            <p className="text-red-500 text-sm text-center">{error}</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-100 rounded-2xl gap-3">
            <BookOpen size={32} className="text-slate-300" aria-hidden="true" />
            <p className="text-slate-400 text-sm">No training categories available yet.</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={container}
          >
            {categories.map((category) => (
              <CategoryCard
                key={category.uid}
                category={category}
                onCardClick={handleCardClick}
              />
            ))}
          </motion.div>
        )}

      </div>
    </section>
  );
};

export default TrainingFields;
