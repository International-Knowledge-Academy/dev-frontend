// @ts-nocheck
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MdArrowForward, MdMenuBook } from "react-icons/md";
import type { Category } from "types/category";

interface Props {
  category: Category;
}

const CategoryCard = ({ category }: Props) => {
  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="group bg-white border border-slate-100 hover:border-gold-300 hover:shadow-lg rounded-2xl overflow-hidden flex flex-col transition-all duration-300"
    >
      {/* Top accent line */}
      <div className="h-1 w-full bg-gradient-to-r from-navy-600 via-gold-500 to-navy-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="p-6 flex flex-col flex-1">
        {/* Icon */}
        <div className="w-11 h-11 rounded-xl bg-navy-50 text-navy-600 flex items-center justify-center group-hover:bg-gold-50 group-hover:text-gold-600 transition-colors duration-300 mb-4">
          <MdMenuBook size={22} />
        </div>

        {/* Name */}
        <h3 className="text-navy-800 font-bold text-base leading-snug mb-2 group-hover:text-navy-600 transition-colors line-clamp-2">
          {category.name}
        </h3>

        {/* Summary */}
        {category.summary && (
          <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 flex-1 mb-2">
            {category.summary}
          </p>
        )}
        {!category.summary && <div className="flex-1" />}

        {/* CTA */}
        <div className="mt-auto pt-4 border-t border-slate-100">
          <Link
            to={`/training?category=${category.uid}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-600 group-hover:text-gold-600 transition-colors"
          >
            View Courses
            <MdArrowForward size={15} className="group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CategoryCard;
