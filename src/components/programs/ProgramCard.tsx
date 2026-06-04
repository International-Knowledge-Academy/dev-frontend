// @ts-nocheck
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  BookOpen, Award, Briefcase, Clock, MapPin,
  ArrowRight, Users, Globe,
} from "lucide-react";
import type { Program } from "types/program";

/* ─── Config ─────────────────────────────────────────────────────────────── */

const typeConfig: Record<string, { label: string; bg: string; text: string }> = {
  course:     { label: "Course",     bg: "bg-navy-50/90",   text: "text-navy-600"  },
  diploma:    { label: "Diploma",    bg: "bg-gold-50/90",   text: "text-gold-700"  },
  contracted: { label: "Contracted", bg: "bg-slate-100/90", text: "text-slate-600" },
};

const TypeIcon: Record<string, React.ElementType> = {
  course:     BookOpen,
  diploma:    Award,
  contracted: Briefcase,
};

const statusConfig: Record<string, { dot: string; text: string; bg: string }> = {
  upcoming:  { dot: "bg-blue-400",  text: "text-blue-600",  bg: "bg-blue-50/90"  },
  ongoing:   { dot: "bg-green-400", text: "text-green-600", bg: "bg-green-50/90" },
  completed: { dot: "bg-slate-300", text: "text-slate-500", bg: "bg-slate-100/90"},
  cancelled: { dot: "bg-red-400",   text: "text-red-500",   bg: "bg-red-50/90"   },
};

/* ─── Card ───────────────────────────────────────────────────────────────── */

interface Props {
  program: Program;
}

const ProgramCard = ({ program }: Props) => {
  const navigate           = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const type     = typeConfig[program.program_type] ?? typeConfig.course;
  const Icon     = TypeIcon[program.program_type]   ?? BookOpen;
  const status   = statusConfig[program.status]     ?? statusConfig.upcoming;
  const fieldHex = program.field?.hex_color         ?? "#1B2A5E";

  const showImage = !!program.thumbnail && !imgError;

  return (
    <motion.article
      whileHover={{ y: -5, transition: { duration: 0.2, ease: "easeOut" } }}
      onClick={() => navigate(`/programs/${program.uid}`)}
      role="button"
      tabIndex={0}
      aria-label={`Program: ${program.name}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderColor: hovered ? `${fieldHex}99` : `${fieldHex}33`,
        boxShadow:   hovered ? `0 12px 32px ${fieldHex}28` : `0 2px 8px ${fieldHex}10`,
      }}
      className="group relative bg-white border rounded-2xl overflow-hidden flex flex-col cursor-pointer transition-all duration-300"
    >

      {/* ── Top visual panel ──────────────────────────────────────────── */}
      <div className="relative h-48 flex-shrink-0 overflow-hidden">

        {showImage ? (
          /* Real thumbnail */
          <>
            <img
              src={program.thumbnail}
              alt={program.name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Gradient fade at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
          </>
        ) : (
          /* Fallback: field-colored gradient with icon */
          <>
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${fieldHex}ee 0%, ${fieldHex}88 60%, ${fieldHex}cc 100%)`,
              }}
            />
            {/* Subtle grid pattern */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg,transparent,transparent 24px,rgba(255,255,255,.3) 24px,rgba(255,255,255,.3) 25px)," +
                  "repeating-linear-gradient(90deg,transparent,transparent 24px,rgba(255,255,255,.3) 24px,rgba(255,255,255,.3) 25px)",
              }}
            />
            {/* Centered icon */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center">
                <Icon size={28} className="text-white" />
              </div>
              {program.field && (
                <span className="text-white/80 text-xs font-bold uppercase tracking-widest text-center px-4">
                  {program.field.name}
                </span>
              )}
            </div>
          </>
        )}

        {/* Badges overlaid on image/fallback */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
          <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-md backdrop-blur-sm ${type.bg} ${type.text}`}>
            <Icon size={11} />
            {type.label}
          </span>
          {program.status && (
            <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-md backdrop-blur-sm ${status.bg} ${status.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              {program.status_display ?? program.status}
            </span>
          )}
        </div>

        {/* Field pill at bottom (only when thumbnail shown, fallback already shows it) */}
        {showImage && program.field && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: fieldHex }}
            />
            <span className="text-white text-xs font-semibold drop-shadow">
              {program.field.name}
            </span>
          </div>
        )}
      </div>

      {/* ── Content ───────────────────────────────────────────────────── */}
      <div className="p-5 flex flex-col flex-1">

        {/* Title */}
        <h3 className="text-navy-800 font-bold text-base leading-snug mb-2 line-clamp-2 group-hover:text-navy-600 transition-colors duration-200">
          {program.name}
        </h3>

        {/* Description */}
        {program.description && (
          <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 flex-1 mb-4">
            {program.description}
          </p>
        )}

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-4 border-t border-slate-100 group-hover:border-gold-100 transition-colors duration-300">
          {program.duration && (
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Clock size={11} className="text-gold-400 flex-shrink-0" />
              {program.duration}
            </span>
          )}
          {program.language && (
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Globe size={11} className="text-gold-400 flex-shrink-0" />
              {program.language}
            </span>
          )}
          {program.location && (
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <MapPin size={11} className="text-gold-400 flex-shrink-0" />
              <span className="truncate max-w-[100px]">{program.location.city}</span>
            </span>
          )}
          {program.max_participants && (
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Users size={11} className="text-gold-400 flex-shrink-0" />
              {program.max_participants}
            </span>
          )}

          <span className="ml-auto flex items-center gap-1 text-xs font-bold text-slate-300 group-hover:text-gold-500 transition-colors duration-300">
            Explore
            <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform duration-300" />
          </span>
        </div>

      </div>
    </motion.article>
  );
};

export default ProgramCard;
