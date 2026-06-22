// @ts-nocheck
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, Users, ChevronRight } from "lucide-react";
import useCamps from "hooks/camps/useCamps";

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", delay: d } }),
};

const formatDateRange = (start: string | null, end: string | null) => {
  if (!start) return null;
  const s = new Date(start);
  const fmtDay  = (d: Date) => d.getDate();
  const fmtMon  = (d: Date) => d.toLocaleDateString("en-GB", { month: "short" });
  const fmtYear = (d: Date) => d.getFullYear();
  if (!end) return `${fmtDay(s)} ${fmtMon(s)} ${fmtYear(s)}`;
  const e = new Date(end);
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    return `${fmtDay(s)} – ${fmtDay(e)} ${fmtMon(e)} ${fmtYear(e)}`;
  }
  return `${fmtDay(s)} ${fmtMon(s)} – ${fmtDay(e)} ${fmtMon(e)} ${fmtYear(e)}`;
};

const parseHighlights = (highlights: string | null): string[] => {
  if (!highlights) return [];
  return highlights
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
};

const ACCENTS = ["gold", "navy"];

const CampTypesSection = () => {
  const { camps: allCamps, loading } = useCamps();
  const camps = allCamps.filter((c) => c.status === "upcoming" || c.status === "open");

  if (!loading && camps.length === 0) return null;

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">

        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={fadeUp}
          className="text-center mb-14"
        >
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-gold-600 mb-3">
            Malaysia 2026
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900">Available Clubs</h2>
          <p className="mt-3 text-slate-500 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Two tailored programmes designed for different age groups — each built around a distinct leadership journey.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[0, 1].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-pulse">
                <div className="h-1.5 w-full bg-slate-200" />
                <div className="p-6 sm:p-8 space-y-4">
                  <div className="h-6 bg-slate-200 rounded w-2/3" />
                  <div className="flex gap-2">
                    <div className="h-7 bg-slate-100 rounded-lg w-28" />
                    <div className="h-7 bg-slate-100 rounded-lg w-40" />
                  </div>
                  <div className="h-4 bg-slate-100 rounded w-full" />
                  <div className="h-4 bg-slate-100 rounded w-5/6" />
                  <div className="flex gap-2 flex-wrap">
                    {[1, 2, 3].map((j) => <div key={j} className="h-6 bg-slate-100 rounded-full w-20" />)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {camps.map((camp, i) => {
              const accent      = ACCENTS[i % ACCENTS.length];
              const ageRange    = camp.min_age != null && camp.max_age != null ? `${camp.min_age} – ${camp.max_age}` : null;
              const dateRange   = formatDateRange(camp.start_date, camp.end_date);
              const focusTags   = parseHighlights(camp.highlights);

              return (
                <motion.div
                  key={camp.uid}
                  initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.1}
                  variants={fadeUp}
                  className="relative bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col"
                >
                  {/* Top accent bar */}
                  <div className={`h-1.5 w-full ${accent === "gold" ? "bg-gradient-to-r from-gold-400 to-gold-600" : "bg-gradient-to-r from-navy-600 to-navy-800"}`} />

                  <div className="p-6 sm:p-8 flex flex-col flex-1">
                    <h3 className="text-xl font-extrabold text-navy-900 mb-4">{camp.name}</h3>

                    {/* Meta pills */}
                    <div className="flex flex-wrap gap-2.5 mb-5">
                      {ageRange && (
                        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5">
                          <Users size={13} className="text-navy-400" />
                          <span className="text-xs font-semibold text-navy-700">Age {ageRange}</span>
                        </div>
                      )}
                      {dateRange && (
                        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5">
                          <Calendar size={13} className="text-navy-400" />
                          <span className="text-xs font-semibold text-navy-700">{dateRange}</span>
                        </div>
                      )}
                    </div>

                    {camp.description && (
                      <p className="text-sm text-slate-500 leading-relaxed mb-6">{camp.description}</p>
                    )}

                    {/* Focus tags */}
                    {focusTags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-8">
                        {focusTags.map((f) => (
                          <span key={f}
                            className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                              accent === "gold"
                                ? "bg-gold-50 text-gold-700 border-gold-200"
                                : "bg-navy-50 text-navy-700 border-navy-100"
                            }`}
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-auto">
                      <Link
                        to="/register/club"
                        className={`inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-md lg:rounded-lg transition-all duration-200 ${
                          accent === "gold"
                            ? "bg-gold-500 hover:bg-gold-400 text-navy-900"
                            : "bg-navy-800 hover:bg-navy-700 text-white"
                        }`}
                      >
                        Register Your Interest <ChevronRight size={14} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default CampTypesSection;
