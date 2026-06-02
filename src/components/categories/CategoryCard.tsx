// @ts-nocheck
import { motion } from "framer-motion";
import { BookOpen, ArrowRight } from "lucide-react";
import type { Category } from "types/category";

interface Props {
  category: Category;
  onCardClick?: (c: Category) => void;
}

const CategoryCard = ({ category, onCardClick }: Props) => (
  <motion.article
    whileHover={{ y: -5, transition: { duration: 0.2, ease: "easeOut" } }}
    onClick={() => onCardClick?.(category)}
    role={onCardClick ? "button" : undefined}
    tabIndex={onCardClick ? 0 : undefined}
    aria-label={`Training category: ${category.name}`}
    className="group relative bg-white border border-slate-100 hover:border-gold-300 rounded-2xl p-6 flex flex-col cursor-pointer hover:shadow-[0_8px_32px_rgba(201,168,76,0.14)] transition-all duration-300 overflow-hidden"
  >
    {/* Animated top border sweep */}
    <span
      className="absolute top-0 left-0 h-[2px] rounded-r-full bg-gradient-to-r from-gold-400 via-gold-500 to-gold-300 w-0 group-hover:w-full transition-[width] duration-500 ease-out pointer-events-none"
      aria-hidden="true"
    />

    {/* Hover background glow */}
    <span
      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 bg-gradient-to-br from-gold-50/60 via-transparent to-transparent transition-opacity duration-500 pointer-events-none"
      aria-hidden="true"
    />

    {/* Corner accent dot */}
    <span
      className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-gold-400 transition-colors duration-300"
      aria-hidden="true"
    />

    {/* Icon */}
    <div className="relative w-12 h-12 rounded-xl bg-navy-50 border border-navy-100 group-hover:bg-gold-50 group-hover:border-gold-200 flex items-center justify-center mb-5 flex-shrink-0 transition-all duration-300">
      <BookOpen size={21} className="text-navy-600 group-hover:text-gold-500 transition-colors duration-300" aria-hidden="true" />
    </div>

    {/* Title */}
    <h3 className="text-navy-800 font-bold text-xl leading-snug mb-2.5 pr-5 line-clamp-2">
      {category.name}
    </h3>

    {/* Summary */}
    <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 flex-1 mb-5">
      {category.summary || "Specialized training program designed for professional development and career advancement."}
    </p>

    {/* Footer */}
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

export default CategoryCard;
