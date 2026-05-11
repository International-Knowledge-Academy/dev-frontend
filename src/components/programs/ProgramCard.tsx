// @ts-nocheck
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  BookOpen, Award, Briefcase, Clock, MapPin,
  ArrowRight, Users, Globe,
} from "lucide-react";
import type { Program } from "types/program";

/* ─── Config ─────────────────────────────────────────────────────────────── */

const typeConfig: Record<string, { label: string; bg: string; text: string }> = {
  course:     { label: "Course",     bg: "bg-navy-50",   text: "text-navy-600"  },
  diploma:    { label: "Diploma",    bg: "bg-gold-50",   text: "text-gold-700"  },
  contracted: { label: "Contracted", bg: "bg-slate-100", text: "text-slate-600" },
};

const TypeIcon: Record<string, React.ElementType> = {
  course:     BookOpen,
  diploma:    Award,
  contracted: Briefcase,
};

const statusConfig: Record<string, { dot: string; text: string }> = {
  upcoming:  { dot: "bg-blue-400",  text: "text-blue-500"  },
  ongoing:   { dot: "bg-green-400", text: "text-green-600" },
  completed: { dot: "bg-slate-300", text: "text-slate-400" },
  cancelled: { dot: "bg-red-400",   text: "text-red-500"   },
};

/* ─── Card ───────────────────────────────────────────────────────────────── */

interface Props {
  program: Program;
}

const ProgramCard = ({ program }: Props) => {
  const navigate = useNavigate();

  const type      = typeConfig[program.program_type]   ?? typeConfig.course;
  const Icon      = TypeIcon[program.program_type]     ?? BookOpen;
  const status    = statusConfig[program.status]       ?? statusConfig.upcoming;
  const fieldHex  = program.field?.hex_color           ?? "#1B2A5E";

  return (
    <motion.article
      whileHover={{ y: -5, transition: { duration: 0.2, ease: "easeOut" } }}
      onClick={() => navigate(`/programs/${program.uid}`)}
      role="button"
      tabIndex={0}
      aria-label={`Program: ${program.name}`}
      style={{ borderColor: `${fieldHex}55` }}
      className="group relative bg-white border rounded-2xl overflow-hidden flex flex-col cursor-pointer transition-all duration-300"
    >
      {/* Field color accent bar */}
      <div
        className="h-1 w-full flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity duration-300"
        style={{ backgroundColor: fieldHex }}
      />

      {/* Animated gold top border sweep */}
      <span
        className="absolute top-0 left-0 h-[3px] rounded-r-full bg-gradient-to-r from-gold-400 via-gold-500 to-gold-300 w-0 group-hover:w-full transition-[width] duration-500 ease-out pointer-events-none z-10"
        aria-hidden="true"
      />

      {/* Hover background glow */}
      <span
        className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-gold-50/50 via-transparent to-transparent transition-opacity duration-500 pointer-events-none"
        aria-hidden="true"
      />

      <div className="p-6 flex flex-col flex-1">

        {/* Header row: type badge + status */}
        <div className="flex items-center justify-between mb-4">
          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-md ${type.bg} ${type.text}`}>
            <Icon size={11} aria-hidden="true" />
            {type.label}
          </span>
          {program.status && (
            <span className={`flex items-center gap-1.5 text-xs font-medium ${status.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              {program.status_display ?? program.status}
            </span>
          )}
        </div>

        {/* Field pill */}
        {program.field && (
          <div className="flex items-center gap-1.5 mb-3">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: fieldHex }}
            />
            <span className="text-xs font-semibold text-slate-500 truncate">
              {program.field.name}
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-navy-800 font-bold text-base leading-snug mb-2.5 line-clamp-2 group-hover:text-navy-600 transition-colors duration-200">
          {program.name}
        </h3>

        {/* Description */}
        {program.description && (
          <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 flex-1 mb-5">
            {program.description}
          </p>
        )}

        {/* Meta footer */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-4 border-t border-slate-100 group-hover:border-gold-100 transition-colors duration-300">
          {program.duration && (
            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              <Clock size={12} className="text-gold-400 flex-shrink-0" />
              {program.duration}
            </span>
          )}
          {program.language && (
            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              <Globe size={12} className="text-gold-400 flex-shrink-0" />
              {program.language}
            </span>
          )}
          {program.location && (
            <span className="flex items-center gap-1.5 text-xs text-slate-400 truncate">
              <MapPin size={12} className="text-gold-400 flex-shrink-0" />
              <span className="truncate">{program.location.city}</span>
            </span>
          )}
          {program.max_participants && (
            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              <Users size={12} className="text-gold-400 flex-shrink-0" />
              {program.max_participants}
            </span>
          )}

          {/* Explore arrow */}
          <span className="ml-auto flex items-center gap-1 text-xs font-bold text-slate-300 group-hover:text-gold-500 transition-colors duration-300">
            Explore
            <ArrowRight
              size={12}
              className="group-hover:translate-x-0.5 transition-transform duration-300"
            />
          </span>
        </div>

      </div>
    </motion.article>
  );
};

export default ProgramCard;
