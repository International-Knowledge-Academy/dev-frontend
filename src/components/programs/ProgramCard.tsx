// @ts-nocheck
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  BookOpen, Award, Briefcase, Clock, MapPin,
  Calendar, Globe, Wifi, WifiOff, MonitorPlay,
  ArrowRight,
} from "lucide-react";
import type { Program } from "types/program";

/* ─── Config ─────────────────────────────────────────────────────────────── */

const TYPE: Record<string, { label: string; Icon: React.ElementType }> = {
  course:     { label: "Course",     Icon: BookOpen  },
  diploma:    { label: "Diploma",    Icon: Award     },
  contracted: { label: "Contracted", Icon: Briefcase },
};

const STATUS: Record<string, { dot: string; ring: string; label?: string }> = {
  upcoming:  { dot: "bg-blue-400",  ring: "border-blue-200  text-blue-600  bg-blue-50"   },
  ongoing:   { dot: "bg-green-400", ring: "border-green-200 text-green-600 bg-green-50"  },
  completed: { dot: "bg-slate-300", ring: "border-slate-200 text-slate-500 bg-slate-50"  },
  cancelled: { dot: "bg-red-400",   ring: "border-red-200   text-red-500   bg-red-50"    },
};

const MODE: Record<string, { label: string; Icon: React.ElementType; color: string }> = {
  online:  { label: "Online",  Icon: Wifi,        color: "text-teal-500"  },
  offline: { label: "On-site", Icon: WifiOff,     color: "text-slate-500" },
  hybrid:  { label: "Hybrid",  Icon: MonitorPlay, color: "text-indigo-500"},
};

const formatDate = (d: string | null) => {
  if (!d) return null;
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

/* ─── Card ───────────────────────────────────────────────────────────────── */

const ProgramCard = ({ program }: { program: Program }) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const { label: typeLabel, Icon } = TYPE[program.program_type] ?? TYPE.course;
  const statusCfg  = STATUS[program.status] ?? STATUS.upcoming;
  const modeCfg    = MODE[program.mode];
  const fieldHex   = program.field?.hex_color ?? "#1B2A5E";
  const showImage  = !!program.thumbnail && !imgError;
  const startDate  = formatDate(program.start_date);
  const hasPrice   = !!program.price && program.price !== "0.00";

  return (
    <motion.article
      whileHover={{ y: -6, transition: { duration: 0.2, ease: "easeOut" } }}
      onClick={() => navigate(`/programs/${program.uid}`)}
      role="button"
      tabIndex={0}
      aria-label={`Program: ${program.name}`}
      className="group relative bg-white rounded-2xl overflow-hidden flex flex-col cursor-pointer border border-slate-100 hover:border-gold-200 shadow-sm hover:shadow-xl hover:shadow-gold-100/40 transition-all duration-300"
    >

      {/* ── Visual header ─────────────────────────────────────────────── */}
      <div className="relative h-44 flex-shrink-0 overflow-hidden">

        {showImage ? (
          <>
            <img
              src={program.thumbnail}
              alt={program.name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          </>
        ) : (
          <>
            {/* Gradient bg */}
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
                  "repeating-linear-gradient(45deg, rgba(255,255,255,.8) 0px, rgba(255,255,255,.8) 1px, transparent 1px, transparent 12px)",
              }}
            />
            {/* Center icon */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5">
              <div className="w-14 h-14 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center backdrop-blur-sm">
                <Icon size={26} className="text-white" />
              </div>
              <span className="text-white/75 text-[11px] font-bold uppercase tracking-[0.15em] text-center px-6 line-clamp-1">
                {program.field?.name ?? typeLabel}
              </span>
            </div>
          </>
        )}

        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
          {/* Type */}
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-md bg-white/90 backdrop-blur-sm text-navy-700">
            <Icon size={10} />
            {typeLabel}
          </span>
          {/* Status */}
          {program.status && (
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-sm border ${statusCfg.ring}`}>
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusCfg.dot}`} />
              {program.status_display ?? program.status}
            </span>
          )}
        </div>

        {/* Bottom: field name on image  /  mode badge */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
          {showImage && program.field && (
            <span className="text-white text-[11px] font-semibold drop-shadow line-clamp-1">
              {program.field.name}
            </span>
          )}
          {modeCfg && (
            <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-md bg-white/90 backdrop-blur-sm text-slate-600">
              <modeCfg.Icon size={10} className={modeCfg.color} />
              {modeCfg.label}
            </span>
          )}
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────────────── */}
      <div className="p-5 flex flex-col flex-1">

        {/* Title */}
        <h3 className="text-navy-800 font-bold text-[15px] leading-snug mb-2 line-clamp-2 group-hover:text-navy-600 transition-colors duration-200">
          {program.name}
        </h3>

        {/* Description */}
        <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 flex-1 mb-4">
          {program.description || "A professional training program designed to advance your career."}
        </p>

        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-2 mb-5">
          {startDate && (
            <span className="flex items-center gap-1.5 text-xs text-slate-500 min-w-0">
              <Calendar size={11} className="text-gold-400 flex-shrink-0" />
              <span className="truncate">{startDate}</span>
            </span>
          )}
          {program.location && (
            <span className="flex items-center gap-1.5 text-xs text-slate-500 min-w-0">
              <MapPin size={11} className="text-gold-400 flex-shrink-0" />
              <span className="truncate">{program.location.city}</span>
            </span>
          )}
          {program.duration && (
            <span className="flex items-center gap-1.5 text-xs text-slate-500 min-w-0">
              <Clock size={11} className="text-gold-400 flex-shrink-0" />
              <span className="truncate">{program.duration}</span>
            </span>
          )}
          {program.language && (
            <span className="flex items-center gap-1.5 text-xs text-slate-500 min-w-0">
              <Globe size={11} className="text-gold-400 flex-shrink-0" />
              <span className="truncate">{program.language}</span>
            </span>
          )}
        </div>

        {/* Footer: price + CTA */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100 group-hover:border-gold-100 transition-colors duration-300">
          {/* Price */}
          <div className="min-w-0">
            {hasPrice ? (
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold leading-none block mb-0.5">
                  From
                </span>
                <span className="text-navy-800 font-extrabold text-sm leading-none">
                  {program.currency ?? ""} {program.price}
                </span>
              </div>
            ) : (
              <span className="text-[11px] font-semibold text-slate-400">
                Contact for pricing
              </span>
            )}
          </div>

          {/* CTA button */}
          <button
            type="button"
            className="inline-flex items-center gap-1.5 bg-navy-700 group-hover:bg-gold-500 text-white group-hover:text-navy-900 text-xs font-bold px-4 py-2 rounded-md transition-all duration-200 flex-shrink-0"
          >
            Register
            <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform duration-200" />
          </button>
        </div>

      </div>

      {/* Left field-color accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ backgroundColor: fieldHex }}
      />
    </motion.article>
  );
};

export default ProgramCard;
