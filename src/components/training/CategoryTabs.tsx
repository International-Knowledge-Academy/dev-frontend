// @ts-nocheck
import { useRef } from "react";
import { motion } from "framer-motion";
import type { Category } from "types/category";

interface Props {
  categories: Category[];
  selected: string | null;
  onSelect: (uid: string | null) => void;
}

const CategoryTabs = ({ categories, selected, onSelect }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="bg-white border-b border-slate-100 sticky top-[72px] z-40">
      <div className="max-w-6xl mx-auto px-6">
        <div
          ref={scrollRef}
          className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* All tab */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(null)}
            className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              selected === null
                ? "bg-navy-600 text-white shadow-sm"
                : "text-slate-500 hover:text-navy-700 hover:bg-navy-50"
            }`}
          >
            All Categories
          </motion.button>

          {categories.map((cat, idx) => (
            <motion.button
              key={cat.uid}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(cat.uid)}
              className={`flex-shrink-0 flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                selected === cat.uid
                  ? "bg-navy-600 text-white shadow-sm"
                  : "text-slate-500 hover:text-navy-700 hover:bg-navy-50"
              }`}
            >
              {cat.name}
              {cat.course_count > 0 && (
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                    selected === cat.uid
                      ? "bg-gold-500 text-navy-900"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {cat.course_count}
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryTabs;
