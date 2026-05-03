// @ts-nocheck
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MdArrowBack, MdWorkspacePremium, MdLocationOn,
  MdAccessTime, MdSettings, MdLanguage, MdCalendarToday,
  MdPeople, MdEmail, MdPhone, MdLink, MdSchool, MdHandshake,
  MdHeadsetMic,
} from "react-icons/md";

import Navbar from "components/home/Navbar";
import Footer from "components/home/Footer";
import useGetProgram from "hooks/programs/useGetProgram";

const countryFlags: Record<string, string> = {
  UAE: "🇦🇪", UK: "🇬🇧", Spain: "🇪🇸", Netherlands: "🇳🇱",
  Germany: "🇩🇪", Malaysia: "🇲🇾", Turkey: "🇹🇷", Egypt: "🇪🇬",
  Indonesia: "🇮🇩", Jordan: "🇯🇴", France: "🇫🇷", Italy: "🇮🇹",
  USA: "🇺🇸", Canada: "🇨🇦", Singapore: "🇸🇬",
};

const typeConfig: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
  course:     { label: "Training Course",    cls: "bg-navy-100 text-navy-700",    icon: <MdSchool size={14} /> },
  diploma:    { label: "Training Diploma",   cls: "bg-gold-100 text-gold-700",    icon: <MdWorkspacePremium size={14} /> },
  contracted: { label: "Contracted Program", cls: "bg-purple-100 text-purple-700",icon: <MdHandshake size={14} /> },
};

const statusBadge: Record<string, string> = {
  upcoming:  "bg-blue-50 text-blue-600 border-blue-600",
  ongoing:   "bg-green-50 text-green-600 border-green-600",
  completed: "bg-slate-100 text-slate-500 border-slate-500",
  cancelled: "bg-red-50 text-red-500 border-red-500",
};

const levelColors: Record<string, string> = {
  beginner:     "text-emerald-600 bg-emerald-50",
  intermediate: "text-amber-600 bg-amber-50",
  advanced:     "text-purple-600 bg-purple-50",
};

const modeColors: Record<string, string> = {
  online:  "text-cyan-600 bg-cyan-50",
  offline: "text-orange-600 bg-orange-50",
  hybrid:  "text-indigo-600 bg-indigo-50",
};

const formatDate = (d: string | null) => {
  if (!d) return null;
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
};

const InfoChip = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-100 rounded-xl text-sm text-navy-700 shadow-sm">
    <span className="text-navy-400">{icon}</span>
    {label}
  </div>
);

const ProgramPage = () => {
  const { uid } = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const { program, loading, error } = useGetProgram(uid);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-navy-50 animate-pulse mx-auto" />
            <div className="h-6 bg-slate-100 rounded w-64 mx-auto animate-pulse" />
            <div className="h-4 bg-slate-100 rounded w-48 mx-auto animate-pulse" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center flex-col gap-4 py-20">
          <p className="text-red-400 text-sm">{error ?? "Program not found."}</p>
          <button
            onClick={() => navigate("/programs")}
            className="text-sm font-semibold text-navy-700 hover:underline"
          >
            Back to Programs
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const type = typeConfig[program.program_type] ?? typeConfig.course;
  const flag = countryFlags[program.location?.country] ?? "🌍";
  const startDate = formatDate(program.start_date);
  const endDate   = formatDate(program.end_date);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-navy-600 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500 opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-6 py-20">
          {/* Back */}
          <motion.button
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => navigate("/programs")}
            className="inline-flex items-center gap-2 text-navy-300 hover:text-white text-sm mb-8 transition"
          >
            <MdArrowBack size={16} />
            All Programs
          </motion.button>

          {/* Type + Status */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center gap-2 mb-5"
          >
            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${type.cls}`}>
              {type.icon}
              {type.label}
            </span>
            {program.field && (
              <span className="text-xs text-gold-400 font-medium">
                {program.field.name}
              </span>
            )}
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${statusBadge[program.status] ?? "bg-slate-50 text-slate-500 border-slate-200"}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {program.status_display ?? program.status}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4 max-w-3xl"
          >
            {program.name}
          </motion.h1>

          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center gap-2 text-sm text-navy-300"
          >
            <span>Home</span>
            <span className="text-gold-500">/</span>
            <button onClick={() => navigate("/programs")} className="hover:text-white transition">Programs</button>
            <span className="text-gold-500">/</span>
            <span className="text-gold-400 font-medium truncate max-w-xs">{program.name}</span>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main column */}
          <div className="lg:col-span-2 space-y-8">

            {/* Quick chips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap gap-3"
            >
              {program.duration && (
                <InfoChip icon={<MdAccessTime size={16} />} label={program.duration} />
              )}
              {program.language && (
                <InfoChip icon={<MdLanguage size={16} />} label={program.language} />
              )}
              {program.level && (
                <span className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-100 ${levelColors[program.level] ?? "text-navy-700 bg-white"}`}>
                  <MdSettings size={16} />
                  {program.level_display ?? program.level}
                </span>
              )}
              {program.mode && (
                <span className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-100 ${modeColors[program.mode] ?? "text-navy-700 bg-white"}`}>
                  <MdSettings size={16} />
                  {program.mode_display ?? program.mode}
                </span>
              )}
              {program.location && (
                <InfoChip
                  icon={<><span>{flag}</span><MdLocationOn size={16} /></>}
                  label={`${program.location.city}, ${program.location.country}`}
                />
              )}
              {program.max_participants && (
                <InfoChip icon={<MdPeople size={16} />} label={`Max ${program.max_participants} participants`} />
              )}
            </motion.div>

            {/* Dates */}
            {(startDate || endDate) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm"
              >
                <h2 className="text-sm font-bold text-navy-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <MdCalendarToday size={16} className="text-gold-500" />
                  Schedule
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {startDate && (
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Start Date</p>
                      <p className="text-sm font-semibold text-navy-800">{startDate}</p>
                    </div>
                  )}
                  {endDate && (
                    <div>
                      <p className="text-xs text-slate-400 mb-1">End Date</p>
                      <p className="text-sm font-semibold text-navy-800">{endDate}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Description */}
            {program.description && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm"
              >
                <h2 className="text-sm font-bold text-navy-800 uppercase tracking-widest mb-4">
                  About This Program
                </h2>
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap text-sm">
                  {program.description}
                </p>
              </motion.div>
            )}

          </div>

          {/* Sidebar */}
          <div className="space-y-5">

            {/* CTA card */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-navy-800 rounded-2xl p-6 text-white shadow-lg"
            >
              <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center text-gold-400 mb-4">
                <MdHeadsetMic size={24} />
              </div>
              <h3 className="font-bold text-base mb-2">Interested in this program?</h3>
              <p className="text-navy-300 text-sm leading-relaxed mb-5">
                Contact our team to learn more, request a brochure, or register your interest.
              </p>
              <button
                onClick={() => navigate("/contact")}
                className="w-full bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold py-2.5 rounded-xl text-sm transition"
              >
                Get in Touch
              </button>
            </motion.div>

            {/* Contact details */}
            {(program.contact_email || program.contact_phone) && (
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4"
              >
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Contact
                </h3>
                {program.contact_email && (
                  <a
                    href={`mailto:${program.contact_email}`}
                    className="flex items-center gap-3 text-sm text-navy-700 hover:text-gold-600 transition"
                  >
                    <MdEmail size={18} className="text-gold-500 flex-shrink-0" />
                    {program.contact_email}
                  </a>
                )}
                {program.contact_phone && (
                  <a
                    href={`tel:${program.contact_phone}`}
                    className="flex items-center gap-3 text-sm text-navy-700 hover:text-gold-600 transition"
                  >
                    <MdPhone size={18} className="text-gold-500 flex-shrink-0" />
                    {program.contact_phone}
                  </a>
                )}
              </motion.div>
            )}

            {/* Brochure */}
            {program.brochure_url && (
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-3"
              >
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Brochure
                </h3>
                <a
                  href={program.brochure_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 text-sm text-navy-700 hover:text-gold-600 transition"
                >
                  <MdLink size={18} className="text-gold-500 flex-shrink-0" />
                  Download Brochure
                </a>
              </motion.div>
            )}

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProgramPage;
