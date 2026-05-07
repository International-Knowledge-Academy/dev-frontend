// @ts-nocheck
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Clock, ArrowRight, Layers, ChevronRight } from "lucide-react";
import usePrograms from "hooks/programs/usePrograms";
import type { Program } from "types/program";

/* ─── Helpers ──────────────────────────────────────────────────────────────── */

const STATUS_STYLES = {
  upcoming:  "bg-gold-50  text-gold-700  border-gold-200",
  ongoing:   "bg-green-50 text-green-700 border-green-200",
  completed: "bg-slate-100 text-slate-500 border-slate-200",
  cancelled: "bg-red-50   text-red-600   border-red-200",
};

const formatDate = (d: string | null) => {
  if (!d) return null;
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

/* ─── Animation variants ───────────────────────────────────────────────────── */

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, ease: "easeOut", delay },
  }),
};

const container = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariant = {
  hidden:  { opacity: 0, y: 22, scale: 0.97 },
  visible: { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.45, ease: "easeOut" } },
};

/* ─── Skeleton ─────────────────────────────────────────────────────────────── */

const SkeletonCard = () => (
  <div className="relative rounded-2xl bg-slate-100 border border-slate-100 p-6 h-72 overflow-hidden">
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    <div className="flex justify-between mb-4">
      <div className="h-5 w-1/3 rounded-full bg-slate-200" />
      <div className="h-5 w-1/4 rounded-full bg-slate-200" />
    </div>
    <div className="h-6 w-3/4 rounded-lg bg-slate-200 mb-2" />
    <div className="h-4 w-full  rounded    bg-slate-200 mb-1.5" />
    <div className="h-4 w-5/6  rounded    bg-slate-200 mb-5" />
    <div className="h-3.5 w-1/2 rounded   bg-slate-200 mb-2" />
    <div className="h-3.5 w-2/3 rounded   bg-slate-200 mb-2" />
    <div className="h-3.5 w-2/5 rounded   bg-slate-200 mt-auto" />
  </div>
);

/* ─── Program card ─────────────────────────────────────────────────────────── */

const ProgramCard = ({ program }: { program: Program }) => {
  const navigate = useNavigate();
  const statusClass = STATUS_STYLES[program.status] ?? STATUS_STYLES.upcoming;

  return (
    <motion.article
      variants={cardVariant}
      whileHover={{ y: -5, transition: { duration: 0.2, ease: "easeOut" } }}
      onClick={() => navigate(`/programs/${program.uid}`)}
      className="group relative bg-white border border-slate-100 hover:border-gold-300 rounded-2xl p-6 flex flex-col cursor-pointer hover:shadow-[0_8px_32px_rgba(201,168,76,0.14)] transition-all duration-300 overflow-hidden"
    >
      {/* Animated top-border sweep */}
      <span className="absolute top-0 left-0 h-[2px] rounded-r-full bg-gradient-to-r from-gold-400 via-gold-500 to-gold-300 w-0 group-hover:w-full transition-[width] duration-500 ease-out pointer-events-none" />
      {/* Hover background glow */}
      <span className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 bg-gradient-to-br from-gold-50/60 via-transparent to-transparent transition-opacity duration-500 pointer-events-none" />

      {/* Badges row */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        {program.field ? (
          <span
            className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border"
            style={{
              backgroundColor: program.field.hex_color ? `${program.field.hex_color}18` : "#f8fafc",
              borderColor:     program.field.hex_color ?? "#e2e8f0",
              color:           program.field.text_color ?? program.field.hex_color ?? "#475569",
            }}
          >
            {program.field.name}
          </span>
        ) : (
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 text-slate-500">
            {program.program_type_display ?? program.program_type}
          </span>
        )}
        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${statusClass}`}>
          {program.status_display ?? program.status}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-navy-800 font-bold text-lg leading-snug mb-2 line-clamp-2 flex-shrink-0">
        {program.name}
      </h3>

      {/* Description */}
      <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
        {program.description || "A professional training program designed to advance your skills and expertise."}
      </p>

      {/* Meta info */}
      <div className="flex flex-col gap-1.5 mb-5">
        {program.location && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <MapPin size={12} className="text-slate-400 flex-shrink-0" />
            <span className="truncate">{program.location.city}, {program.location.country}</span>
          </div>
        )}
        {(program.start_date || program.end_date) && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Calendar size={12} className="text-slate-400 flex-shrink-0" />
            <span>
              {formatDate(program.start_date)}
              {program.end_date ? ` – ${formatDate(program.end_date)}` : ""}
            </span>
          </div>
        )}
        {program.duration && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock size={12} className="text-slate-400 flex-shrink-0" />
            <span>{program.duration}</span>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="flex items-center gap-2 pt-4 border-t border-slate-100 group-hover:border-gold-100 transition-colors duration-300">
        <span className="text-slate-400 group-hover:text-gold-500 text-xs font-bold uppercase tracking-widest transition-colors duration-300">
          View & Register
        </span>
        <ArrowRight size={13} className="text-slate-400 group-hover:text-gold-500 group-hover:translate-x-1 transition-all duration-300" />
      </div>
    </motion.article>
  );
};

/* ─── Section ──────────────────────────────────────────────────────────────── */

const UpcomingPrograms = () => {
  const navigate = useNavigate();
  const { programs, loading, error } = usePrograms({ ordering: "-created_at", is_active: true });
  const displayed = programs.slice(0, 6);

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16 space-y-5">
          <motion.div
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            className="flex justify-center"
          >
            <span className="inline-flex items-center gap-2 bg-navy-50 border border-navy-100 text-navy-600 text-[11px] font-bold uppercase tracking-[0.15em] px-4 py-2 rounded-full">
              <Layers size={11} />
              Live Programs
            </span>
          </motion.div>

          <motion.h2
            custom={0.08}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            className="text-3xl md:text-5xl font-extrabold text-navy-800 leading-tight tracking-tight"
          >
            Upcoming{" "}
            <span className="bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 bg-clip-text text-transparent">
              Programs
            </span>
          </motion.h2>

          <motion.p
            custom={0.16}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            className="text-slate-500 max-w-lg mx-auto text-sm md:text-base leading-relaxed"
          >
            Browse our latest training programs and secure your place today.
          </motion.p>

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

        {/* Grid / States */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <div className="flex items-center justify-center p-8 bg-red-50 border border-red-200 rounded-2xl">
            <p className="text-red-500 text-sm text-center">{error}</p>
          </div>
        ) : displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-50 border border-slate-100 rounded-2xl gap-3">
            <Layers size={32} className="text-slate-300" />
            <p className="text-slate-400 text-sm">No programs available right now. Check back soon.</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={container}
          >
            {displayed.map((program) => (
              <ProgramCard key={program.uid} program={program} />
            ))}
          </motion.div>
        )}

        {/* View all CTA */}
        {!loading && displayed.length > 0 && (
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <button
              onClick={() => navigate("/programs")}
              className="inline-flex items-center gap-2 bg-navy-800 hover:bg-navy-700 text-white font-semibold text-sm px-8 py-3 rounded-md lg:rounded-lg transition-colors duration-200"
            >
              View All Programs
              <ChevronRight size={16} />
            </button>
          </motion.div>
        )}

      </div>
    </section>
  );
};

export default UpcomingPrograms;
