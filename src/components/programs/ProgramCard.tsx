// @ts-nocheck
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  BookOpen, Award, Briefcase, Clock, MapPin,
  Calendar, Globe, Wifi, WifiOff, MonitorPlay, ArrowRight,
} from "lucide-react";
import type { Program } from "types/program";

/* ─── Config ──────────────────────────────────────────────────────────────── */

const TYPE: Record<string, { label: string; Icon: React.ElementType }> = {
  course:     { label: "Course",     Icon: BookOpen  },
  diploma:    { label: "Diploma",    Icon: Award     },
  contracted: { label: "Contracted", Icon: Briefcase },
};

const STATUS: Record<string, { dot: string }> = {
  upcoming:  { dot: "bg-blue-400"  },
  ongoing:   { dot: "bg-green-400" },
  completed: { dot: "bg-slate-300" },
  cancelled: { dot: "bg-red-400"   },
};

const MODE: Record<string, { label: string }> = {
  online:  { label: "Online"  },
  offline: { label: "On-site" },
  hybrid:  { label: "Hybrid"  },
};

const formatDate = (d: string | null) => {
  if (!d) return null;
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
};

/* ─── Card ────────────────────────────────────────────────────────────────── */

const ProgramCard = ({ program }: { program: Program }) => {
  const navigate  = useNavigate();
  const [imgErr, setImgErr] = useState(false);

  const { label: typeLabel, Icon } = TYPE[program.program_type] ?? TYPE.course;
  const statusCfg = STATUS[program.status] ?? STATUS.upcoming;
  const modeCfg   = MODE[program.mode];
  const fieldHex  = program.field?.hex_color ?? "#1B2A5E";
  const showImg   = !!program.thumbnail && !imgErr;
  const startDate = formatDate(program.start_date);
  const hasPrice  = !!program.price && program.price !== "0.00";

  return (
    <motion.article
      whileHover={{ y: -5, transition: { duration: 0.18, ease: "easeOut" } }}
      onClick={() => navigate(`/programs/${program.uid}`)}
      role="button"
      tabIndex={0}
      aria-label={`Program: ${program.name}`}
      className="group bg-white rounded-2xl lg:rounded-3xl overflow-hidden flex flex-col cursor-pointer border border-navy-50 hover:border-gold-200 shadow-sm hover:shadow-xl hover:shadow-navy-100/30 transition-all duration-300"
    >

      {/* ── Image / Fallback ──────────────────────────────────────────── */}
      <div className="relative h-40 sm:h-44 md:h-48 flex-shrink-0 overflow-hidden">

        {showImg ? (
          <>
            <img
              src={program.thumbnail}
              alt={program.name}
              onError={() => setImgErr(true)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 via-navy-900/5 to-transparent" />
          </>
        ) : (
          <>
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(145deg, ${fieldHex} 0%, ${fieldHex}aa 100%)`,
              }}
            />
            {/* Diagonal stripe texture */}
            <div
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg,rgba(255,255,255,1) 0,rgba(255,255,255,1) 1px,transparent 0,transparent 50%)",
                backgroundSize: "12px 12px",
              }}
            />
            {/* Centered icon */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white/15 border border-white/20 backdrop-blur-sm flex items-center justify-center">
                <Icon size={22} className="text-white" />
              </div>
              <span className="text-white/70 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.15em] text-center px-4 line-clamp-1">
                {program.field?.name ?? typeLabel}
              </span>
            </div>
          </>
        )}

        {/* ── Top-left: field dark navy pill ────────────────────────── */}
        {program.field && (
          <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 max-w-[45%]">
            <span className="inline-flex items-center bg-navy-900/85 backdrop-blur-sm text-white text-[10px] sm:text-[11px] font-semibold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full truncate">
              {program.field.name}
            </span>
          </div>
        )}

        {/* ── Top-right: status + mode pills ───────────────────────── */}
        <div className="absolute top-2.5 sm:top-3 right-2.5 sm:right-3 flex items-center gap-1 sm:gap-1.5 max-w-[50%]">
          {program.status && (
            <span className="inline-flex items-center gap-1 sm:gap-1.5 bg-white/90 backdrop-blur-sm text-navy-700 text-[10px] sm:text-[11px] font-semibold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-navy-100/70 whitespace-nowrap">
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusCfg.dot}`} />
              {program.status_display ?? program.status}
            </span>
          )}
          {/* Hide mode badge on very small viewports to avoid overlap */}
          {modeCfg && (
            <span className="hidden sm:inline-flex items-center bg-white/90 backdrop-blur-sm text-navy-700 text-[10px] sm:text-[11px] font-semibold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-navy-100/70 whitespace-nowrap">
              {modeCfg.label}
            </span>
          )}
        </div>

        {/* ── Bottom-left: type plain text ─────────────────────────── */}
        <div className="absolute bottom-2.5 sm:bottom-3 left-3 sm:left-4">
          <span className="text-white/80 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.18em]">
            {typeLabel}
          </span>
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────────────── */}
      <div className="px-4 sm:px-5 pt-4 sm:pt-5 pb-4 sm:pb-5 flex flex-col flex-1">

        {/* Title */}
        <h3 className="text-navy-800 font-bold text-sm sm:text-[15px] leading-snug mb-2 sm:mb-2.5 line-clamp-2">
          {program.name}
        </h3>

        {/* Description — gold brand tint */}
        <p className="text-gold-700 text-xs leading-relaxed line-clamp-2 sm:line-clamp-3 flex-1 mb-3 sm:mb-4">
          {program.description || "A professional training program designed to advance your career and develop key skills."}
        </p>

        {/* Meta 2×2 grid */}
        <div className="grid grid-cols-2 gap-x-3 sm:gap-x-4 gap-y-2 sm:gap-y-2.5 mb-4 sm:mb-5">
          {startDate && (
            <span className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs text-navy-500 min-w-0">
              <Calendar size={11} className="text-gold-500 flex-shrink-0" />
              <span className="truncate">{startDate}</span>
            </span>
          )}
          {program.location && (
            <span className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs text-navy-500 min-w-0">
              <MapPin size={11} className="text-gold-500 flex-shrink-0" />
              <span className="truncate">{program.location.city}</span>
            </span>
          )}
          {program.duration && (
            <span className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs text-navy-500 min-w-0">
              <Clock size={11} className="text-gold-500 flex-shrink-0" />
              <span className="truncate">{program.duration}</span>
            </span>
          )}
          {program.language && (
            <span className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs text-navy-500 min-w-0">
              <Globe size={11} className="text-gold-500 flex-shrink-0" />
              <span className="truncate">{program.language}</span>
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-navy-50 mb-3 sm:mb-4" />

        {/* Footer: price + CTA */}
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          {/* Price */}
          <div className="min-w-0 flex-1">
            {hasPrice ? (
              <>
                <p className="text-[9px] sm:text-[10px] text-navy-400 uppercase tracking-wider font-semibold leading-none mb-1">
                  From
                </p>
                <p className="text-navy-800 font-extrabold text-xs sm:text-sm leading-none truncate">
                  {program.currency ?? ""} {program.price}
                </p>
              </>
            ) : (
              <p className="text-[11px] sm:text-xs text-navy-400 font-medium">
                Contact for pricing
              </p>
            )}
          </div>

          {/* CTA button */}
          <button
            type="button"
            className="inline-flex items-center gap-1.5 bg-navy-800 hover:bg-gold-500 hover:text-navy-900 text-white text-[11px] sm:text-xs font-bold px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all duration-200 flex-shrink-0 whitespace-nowrap"
          >
            Register
            <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform duration-200" />
          </button>
        </div>

      </div>
    </motion.article>
  );
};

export default ProgramCard;
