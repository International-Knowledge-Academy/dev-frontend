// @ts-nocheck
import { motion } from "framer-motion";
import { MdLocationOn, MdAccessTime, MdSchool, MdArrowForward } from "react-icons/md";
import type { Course } from "types/course";

const countryFlags: Record<string, string> = {
  UAE: "🇦🇪", UK: "🇬🇧", Spain: "🇪🇸", Netherlands: "🇳🇱",
  Germany: "🇩🇪", Malaysia: "🇲🇾", Turkey: "🇹🇷", Egypt: "🇪🇬",
  Indonesia: "🇮🇩", Jordan: "🇯🇴",
};

const programTypeBadge: Record<string, { label: string; cls: string }> = {
  course:      { label: "Course",     cls: "bg-navy-50 text-navy-600" },
  diploma:     { label: "Diploma",    cls: "bg-gold-50 text-gold-700" },
  contracted:  { label: "Contracted", cls: "bg-slate-100 text-slate-600" },
};

interface Props {
  course: Course;
}

const CourseCard = ({ course }: Props) => {
  const badge = programTypeBadge[course.program_type] ?? programTypeBadge.course;
  const flag  = countryFlags[course.location?.country] ?? "🌍";

  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="group bg-white border border-slate-100 hover:border-gold-300 hover:shadow-lg transition-colors duration-300 rounded-2xl overflow-hidden flex flex-col cursor-default"
    >
      {/* Top accent line */}
      <div className="h-1 w-full bg-gradient-to-r from-navy-600 via-gold-500 to-navy-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="p-6 flex flex-col flex-1">

        {/* Header badges */}
        <div className="flex items-center justify-between mb-4">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badge.cls}`}>
            {badge.label}
          </span>
          {course.code && (
            <span className="text-xs text-gray-300 font-mono">{course.code}</span>
          )}
        </div>

        {/* Category */}
        {course.category && (
          <div className="flex items-center gap-1.5 mb-3">
            <MdSchool size={13} className="text-gold-500 flex-shrink-0" />
            <span className="text-xs text-gold-600 font-medium truncate">
              {course.category.name}
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-navy-800 font-bold text-base leading-snug mb-3 group-hover:text-navy-600 transition-colors line-clamp-2">
          {course.title}
        </h3>

        {/* Short description */}
        {course.short_description && (
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
            {course.short_description}
          </p>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-4 mt-auto pt-4 border-t border-slate-100">
          {/* Duration */}
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <MdAccessTime size={13} className="flex-shrink-0" />
            <span>{course.duration_days} {course.duration_days === 1 ? "Day" : "Days"}</span>
          </div>

          {/* Location */}
          {course.location && (
            <div className="flex items-center gap-1 text-xs text-gray-400 truncate">
              <span className="text-sm">{flag}</span>
              <MdLocationOn size={12} className="flex-shrink-0" />
              <span className="truncate">{course.location.city}</span>
            </div>
          )}

          {/* Arrow */}
          <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="w-7 h-7 rounded-full bg-gold-500 text-white flex items-center justify-center">
              <MdArrowForward size={14} />
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default CourseCard;
