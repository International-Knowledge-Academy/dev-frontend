// @ts-nocheck
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Share2, Download, MapPin, Users, Clock,
  Globe, CheckCircle2, Mail, Phone, Calendar, GraduationCap,
  BookOpen, Award, Briefcase, Monitor, LayoutGrid, Layers,
  ChevronRight, ArrowRight,
} from "lucide-react";
import Navbar from "components/home/Navbar";
import Footer from "components/home/Footer";
import Loading from "components/loading/Loading";
import useGetProgram from "hooks/programs/useGetProgram";
import usePrograms from "hooks/programs/usePrograms";
import ProgramCard from "components/programs/ProgramCard";
import type { ProgramTrainer } from "types/program";

/* ─── Config maps ────────────────────────────────────────────────────────── */

const typeConfig = {
  course:     { label: "Training Course",    Icon: BookOpen,  bg: "bg-navy-50",  text: "text-navy-700",  border: "border-navy-200"  },
  diploma:    { label: "Training Diploma",   Icon: Award,     bg: "bg-gold-50",  text: "text-gold-700",  border: "border-gold-200"  },
  contracted: { label: "Contracted Program", Icon: Briefcase, bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-200" },
};

const statusConfig = {
  upcoming:  { bg: "bg-blue-50",   text: "text-blue-600",  border: "border-blue-200",  dot: "bg-blue-500"  },
  ongoing:   { bg: "bg-green-50",  text: "text-green-600", border: "border-green-200", dot: "bg-green-500" },
  completed: { bg: "bg-slate-100", text: "text-slate-500", border: "border-slate-200", dot: "bg-slate-400" },
  cancelled: { bg: "bg-red-50",    text: "text-red-500",   border: "border-red-200",   dot: "bg-red-400"   },
};

const levelConfig = {
  beginner:     { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  intermediate: { bg: "bg-gold-50",    text: "text-gold-700",    border: "border-gold-200"    },
  advanced:     { bg: "bg-navy-50",    text: "text-navy-700",    border: "border-navy-200"    },
};

const modeIconMap: Record<string, React.ElementType> = {
  online: Monitor, offline: MapPin, hybrid: LayoutGrid,
};

/* ─── Helpers ────────────────────────────────────────────────────────────── */

const formatDate = (d: string | null) =>
  d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : null;

const parseLines = (text: string | null | undefined): string[] =>
  (text ?? "").split("\n").map((l) => l.trim()).filter(Boolean);

const handleShare = async (title: string) => {
  if (navigator.share) {
    await navigator.share({ title, url: window.location.href }).catch(() => {});
  } else {
    await navigator.clipboard.writeText(window.location.href).catch(() => {});
  }
};

/* ─── Section card ───────────────────────────────────────────────────────── */

const SectionCard = ({
  title, icon: Icon, iconColor = "text-gold-500", children,
}: {
  title: string;
  icon: React.ElementType;
  iconColor?: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
    <h3 className="flex items-center gap-2 text-xs font-bold text-navy-800 uppercase tracking-widest mb-5">
      <Icon size={15} className={iconColor} aria-hidden="true" />
      {title}
    </h3>
    {children}
  </div>
);

/* ─── Trainer card ───────────────────────────────────────────────────────── */

const TrainerCard = ({ trainer }: { trainer: ProgramTrainer }) => (
  <div className="flex gap-4 p-4 rounded-xl border border-slate-100 hover:border-gold-200 hover:shadow-sm transition-all duration-200 group">
    {trainer.profile_picture ? (
      <img
        src={trainer.profile_picture}
        alt={trainer.user.name}
        className="w-12 h-12 rounded-full object-cover flex-shrink-0 ring-2 ring-slate-100 group-hover:ring-gold-200 transition-all duration-200"
      />
    ) : (
      <div className="w-12 h-12 rounded-full bg-navy-50 border border-navy-100 flex items-center justify-center flex-shrink-0 text-navy-700 font-bold text-sm group-hover:bg-gold-50 group-hover:border-gold-200 group-hover:text-gold-600 transition-all duration-200">
        {trainer.user.name?.[0]?.toUpperCase() ?? "?"}
      </div>
    )}
    <div className="min-w-0">
      <p className="font-bold text-navy-800 text-sm leading-tight">{trainer.user.name}</p>
      {trainer.title && (
        <p className="text-xs text-gold-600 font-semibold mt-0.5">{trainer.title}</p>
      )}
      {trainer.bio && (
        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">{trainer.bio}</p>
      )}
    </div>
  </div>
);

/* ─── Related programs ───────────────────────────────────────────────────── */

const cardVariant = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const cardContainer = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const RelatedProgramsSection = ({
  fieldUid,
  fieldName,
  excludeUid,
}: {
  fieldUid: string;
  fieldName: string;
  excludeUid: string;
}) => {
  const { programs, loading } = usePrograms({
    field: fieldUid,
    is_active: true,
  });

  const related = programs.filter((p) => p.uid !== excludeUid).slice(0, 3);

  if (!loading && related.length === 0) return null;

  return (
    <section className="border-t border-slate-100 bg-white">
      <div className="max-w-6xl mx-auto px-6 py-14">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-extrabold text-navy-800">Related Programs</h2>
            <p className="text-slate-400 text-sm mt-1">
              More programs in{" "}
              <span className="font-semibold text-navy-600">{fieldName}</span>
            </p>
          </div>
          <Link
            to={`/programs?field=${fieldUid}`}
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-navy-600 hover:text-gold-600 transition-colors duration-200 group"
          >
            View all
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-200" />
          </Link>
        </div>

        {/* Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-50 rounded-2xl border border-slate-100 p-6 animate-pulse">
                <div className="h-4 w-1/3 rounded bg-slate-200 mb-4" />
                <div className="h-5 w-3/4 rounded bg-slate-200 mb-2" />
                <div className="h-3.5 w-full rounded bg-slate-200 mb-1.5" />
                <div className="h-3.5 w-5/6 rounded bg-slate-200 mb-6" />
                <div className="h-px bg-slate-200 mb-4" />
                <div className="flex gap-4">
                  <div className="h-3 w-16 rounded bg-slate-200" />
                  <div className="h-3 w-20 rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cards */}
        {!loading && related.length > 0 && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={cardContainer}
          >
            {related.map((p) => (
              <motion.div key={p.uid} variants={cardVariant}>
                <ProgramCard program={p} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Mobile: view all link */}
        <div className="sm:hidden mt-6 text-center">
          <Link
            to={`/programs?field=${fieldUid}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-600 hover:text-gold-600 transition-colors"
          >
            View all programs
            <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </section>
  );
};

/* ─── Main page ──────────────────────────────────────────────────────────── */

const ProgramPage = () => {
  const { uid }  = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const { program, loading, error } = useGetProgram(uid);

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <Loading text="Loading program..." />
      </div>
      <Footer />
    </div>
  );

  if (error || !program) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20">
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

  const type      = typeConfig[program.program_type]  ?? typeConfig.course;
  const TypeIcon  = type.Icon;
  const status    = statusConfig[program.status]      ?? statusConfig.upcoming;
  const level     = levelConfig[program.level]        ?? levelConfig.beginner;
  const ModeIcon  = modeIconMap[program.mode]         ?? Monitor;
  const startDate = formatDate(program.start_date);
  const endDate   = formatDate(program.end_date);
  const objectives = parseLines(program.objectives);
  const audience   = parseLines(program.target_audience);
  const prereqs    = parseLines(program.prerequisites);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative bg-navy-800 overflow-hidden">

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-[520px] h-[520px] bg-gold-500 opacity-[0.06] rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-[320px] h-[320px] bg-navy-400 opacity-[0.08] rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 pt-8 pb-16">

          {/* Top bar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-between mb-8"
          >
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-navy-300 hover:text-white text-sm font-medium transition-colors duration-200 group"
            >
              <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
              Back
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleShare(program.name)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-300 hover:text-white border border-navy-600 hover:border-navy-500 px-3 py-2 rounded-md lg:rounded-lg transition-all duration-200"
              >
                <Share2 size={12} />
                Share
              </button>
              {program.brochure_url && (
                <a
                  href={program.brochure_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-900 bg-gold-400 hover:bg-gold-300 px-3 py-2 rounded-md lg:rounded-lg transition-all duration-200"
                >
                  <Download size={12} />
                  Brochure
                </a>
              )}
            </div>
          </motion.div>

          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="flex flex-wrap items-center gap-2 mb-5"
          >
            {program.field && (
              <span
                className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border border-white/10 bg-white/10 text-white"
              >
                <Layers size={10} aria-hidden="true" />
                {program.field.name}
              </span>
            )}
            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${type.bg} ${type.text}`}>
              <TypeIcon size={11} aria-hidden="true" />
              {type.label}
            </span>
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${status.bg} ${status.text} ${status.border}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              {program.status_display ?? program.status}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4 max-w-3xl"
          >
            {program.name}
          </motion.h1>

          {/* Tagline */}
          {program.description && (
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18 }}
              className="text-navy-300 text-base leading-relaxed max-w-2xl mb-8 line-clamp-2"
            >
              {program.description}
            </motion.p>
          )}

          {/* Metrics row */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="flex flex-wrap gap-3 mb-8"
          >
            {startDate && (
              <div className="flex items-center gap-2.5 bg-navy-700 border border-navy-600 rounded-xl px-4 py-3">
                <Calendar size={14} className="text-gold-400 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-navy-400 uppercase tracking-widest font-semibold leading-none mb-1">Starts</p>
                  <p className="text-sm font-bold text-white leading-none">{startDate}</p>
                </div>
              </div>
            )}
            {program.duration && (
              <div className="flex items-center gap-2.5 bg-navy-700 border border-navy-600 rounded-xl px-4 py-3">
                <Clock size={14} className="text-gold-400 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-navy-400 uppercase tracking-widest font-semibold leading-none mb-1">Duration</p>
                  <p className="text-sm font-bold text-white leading-none">{program.duration}</p>
                </div>
              </div>
            )}
            {program.max_participants && (
              <div className="flex items-center gap-2.5 bg-navy-700 border border-navy-600 rounded-xl px-4 py-3">
                <Users size={14} className="text-gold-400 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-navy-400 uppercase tracking-widest font-semibold leading-none mb-1">Seats</p>
                  <p className="text-sm font-bold text-white leading-none">{program.max_participants}</p>
                </div>
              </div>
            )}
            {program.language && (
              <div className="flex items-center gap-2.5 bg-navy-700 border border-navy-600 rounded-xl px-4 py-3">
                <Globe size={14} className="text-gold-400 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-navy-400 uppercase tracking-widest font-semibold leading-none mb-1">Language</p>
                  <p className="text-sm font-bold text-white leading-none">{program.language}</p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Hero CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center gap-3"
          >
            <button
              onClick={() => navigate("/contact")}
              className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold px-8 py-3 rounded-md lg:rounded-lg text-sm transition-all duration-200 shadow-lg hover:shadow-gold-500/25 hover:-translate-y-0.5"
            >
              Enroll Now
              <ChevronRight size={15} />
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="inline-flex items-center gap-2 border border-navy-600 hover:border-navy-500 text-navy-300 hover:text-white font-semibold px-6 py-3 rounded-md lg:rounded-lg text-sm transition-all duration-200"
            >
              Request Info
            </button>
          </motion.div>

        </div>
      </section>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <div className="flex-1 max-w-6xl mx-auto w-full px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left column (70%) ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* About */}
            {program.description && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <SectionCard title="About This Program" icon={BookOpen}>
                  <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-wrap">
                    {program.description}
                  </p>
                </SectionCard>
              </motion.div>
            )}

            {/* Objectives */}
            {objectives.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
              >
                <SectionCard title="Program Objectives" icon={CheckCircle2} iconColor="text-emerald-500">
                  <ul className="space-y-3">
                    {objectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                        <span className="text-slate-600 text-sm leading-relaxed">{obj}</span>
                      </li>
                    ))}
                  </ul>
                </SectionCard>
              </motion.div>
            )}

            {/* Target Audience */}
            {program.target_audience && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08 }}
              >
                <SectionCard title="Target Audience" icon={Users} iconColor="text-navy-600">
                  {audience.length > 1 ? (
                    <ul className="space-y-2">
                      {audience.map((line, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-gold-400 flex-shrink-0 mt-1.5" />
                          <span className="text-slate-600 text-sm leading-relaxed">{line}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                      {program.target_audience}
                    </p>
                  )}
                </SectionCard>
              </motion.div>
            )}

            {/* Prerequisites */}
            {program.prerequisites && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.11 }}
              >
                <SectionCard title="Prerequisites" icon={Award} iconColor="text-gold-500">
                  {prereqs.length > 1 ? (
                    <ul className="space-y-2">
                      {prereqs.map((line, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-gold-400 flex-shrink-0 mt-1.5" />
                          <span className="text-slate-600 text-sm leading-relaxed">{line}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                      {program.prerequisites}
                    </p>
                  )}
                </SectionCard>
              </motion.div>
            )}

            {/* Schedule */}
            {(startDate || endDate) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.14 }}
              >
                <SectionCard title="Training Schedule" icon={Calendar}>
                  <div className="grid grid-cols-2 gap-4">
                    {startDate && (
                      <div className="bg-slate-50 rounded-xl p-4">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1.5">Start Date</p>
                        <p className="text-sm font-bold text-navy-800">{startDate}</p>
                      </div>
                    )}
                    {endDate && (
                      <div className="bg-slate-50 rounded-xl p-4">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1.5">End Date</p>
                        <p className="text-sm font-bold text-navy-800">{endDate}</p>
                      </div>
                    )}
                  </div>
                </SectionCard>
              </motion.div>
            )}

            {/* Trainers */}
            {program.trainer_profiles?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.17 }}
              >
                <SectionCard title="Your Trainers" icon={GraduationCap} iconColor="text-navy-600">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {program.trainer_profiles.map((trainer) => (
                      <TrainerCard key={trainer.uid} trainer={trainer} />
                    ))}
                  </div>
                </SectionCard>
              </motion.div>
            )}

          </div>

          {/* ── Right sidebar (30%) ── */}
          <div className="space-y-5">

            {/* Enroll / Pricing card */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative bg-navy-800 rounded-2xl p-6 text-white shadow-lg overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-300" />

              {program.price ? (
                <>
                  <p className="text-[10px] text-navy-400 uppercase tracking-widest font-semibold mb-1">Investment</p>
                  <p className="text-3xl font-extrabold text-white leading-tight">
                    {program.currency ?? "$"}{program.price}
                  </p>
                  <p className="text-xs text-navy-400 mt-0.5 mb-5">per person</p>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-lg bg-gold-500/20 flex items-center justify-center mb-4">
                    <GraduationCap size={20} className="text-gold-400" />
                  </div>
                  <p className="font-bold text-base mb-1.5">Ready to enroll?</p>
                  <p className="text-navy-300 text-xs leading-relaxed mb-5">
                    Contact our team to learn more and reserve your seat.
                  </p>
                </>
              )}

              {startDate && (
                <div className="flex items-center gap-2 text-xs text-navy-300 mb-5">
                  <Calendar size={12} className="text-gold-400 flex-shrink-0" />
                  Starts {startDate}
                </div>
              )}

              <button
                onClick={() => navigate("/contact")}
                className="w-full bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold py-3 rounded-md lg:rounded-lg text-sm transition-all duration-200 mb-2.5"
              >
                Register Now
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="w-full border border-navy-600 hover:border-navy-500 text-navy-300 hover:text-white font-semibold py-2.5 rounded-md lg:rounded-lg text-xs transition-all duration-200"
              >
                Request More Info
              </button>
            </motion.div>

            {/* Location card */}
            {program.location && (
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm"
              >
                <h3 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">
                  <MapPin size={13} className="text-gold-500" />
                  Location
                </h3>
                <p className="font-bold text-navy-800 text-sm mb-1">{program.location.name}</p>
                {program.location.address && (
                  <p className="text-xs text-slate-500 leading-relaxed mb-0.5">{program.location.address}</p>
                )}
                <p className="text-xs text-slate-500">
                  {[program.location.city, program.location.country].filter(Boolean).join(", ")}
                </p>
                {program.location.contact_phone && (
                  <a
                    href={`tel:${program.location.contact_phone}`}
                    className="flex items-center gap-2 mt-3 text-xs text-navy-600 hover:text-gold-600 transition-colors"
                  >
                    <Phone size={12} className="text-gold-500" />
                    {program.location.contact_phone}
                  </a>
                )}
                {program.location.venue_details && (
                  <p className="text-xs text-slate-400 mt-3 leading-relaxed border-t border-slate-50 pt-3">
                    {program.location.venue_details}
                  </p>
                )}
              </motion.div>
            )}

            {/* Program details */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm"
            >
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">
                Program Details
              </h3>
              <div className="space-y-3">
                {program.level && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Level</span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${level.bg} ${level.text} ${level.border}`}>
                      {program.level_display ?? program.level}
                    </span>
                  </div>
                )}
                {program.mode && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Mode</span>
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-navy-700">
                      <ModeIcon size={12} className="text-gold-500" />
                      {program.mode_display ?? program.mode}
                    </span>
                  </div>
                )}
                {program.language && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Language</span>
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-navy-700">
                      <Globe size={12} className="text-gold-500" />
                      {program.language}
                    </span>
                  </div>
                )}
                {program.max_participants && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Capacity</span>
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-navy-700">
                      <Users size={12} className="text-gold-500" />
                      {program.max_participants} seats
                    </span>
                  </div>
                )}
                {program.duration && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Duration</span>
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-navy-700">
                      <Clock size={12} className="text-gold-500" />
                      {program.duration}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Contact */}
            {(program.contact_email || program.contact_phone) && (
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-3"
              >
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Contact
                </h3>
                {program.contact_email && (
                  <a
                    href={`mailto:${program.contact_email}`}
                    className="flex items-center gap-3 hover:text-gold-600 transition-colors group"
                  >
                    <Mail size={15} className="text-gold-500 flex-shrink-0" />
                    <span className="text-xs text-navy-700 group-hover:text-gold-600 truncate transition-colors">
                      {program.contact_email}
                    </span>
                  </a>
                )}
                {program.contact_phone && (
                  <a
                    href={`tel:${program.contact_phone}`}
                    className="flex items-center gap-3 hover:text-gold-600 transition-colors group"
                  >
                    <Phone size={15} className="text-gold-500 flex-shrink-0" />
                    <span className="text-xs text-navy-700 group-hover:text-gold-600 transition-colors">
                      {program.contact_phone}
                    </span>
                  </a>
                )}
              </motion.div>
            )}

            {/* Brochure */}
            {program.brochure_url && (
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm"
              >
                <a
                  href={program.brochure_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gold-50 border border-gold-200 flex items-center justify-center flex-shrink-0 group-hover:bg-gold-100 transition-colors">
                      <Download size={14} className="text-gold-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-navy-800 group-hover:text-gold-600 transition-colors">
                        Download Brochure
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">PDF format</p>
                    </div>
                  </div>
                  <ChevronRight
                    size={14}
                    className="text-slate-300 group-hover:text-gold-500 group-hover:translate-x-0.5 transition-all duration-200"
                  />
                </a>
              </motion.div>
            )}

            {/* Share */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.43 }}
              className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm"
            >
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">
                Share This Program
              </h3>
              <button
                onClick={() => handleShare(program.name)}
                className="w-full flex items-center justify-center gap-2 border border-slate-200 hover:border-navy-300 hover:bg-navy-50 text-navy-700 font-semibold py-2.5 rounded-md lg:rounded-lg text-xs transition-all duration-200"
              >
                <Share2 size={12} />
                Copy Link
              </button>
            </motion.div>

          </div>
        </div>
      </div>

      {/* ── Related Programs ── */}
      {program.field?.uid && (
        <RelatedProgramsSection
          fieldUid={program.field.uid}
          fieldName={program.field.name}
          excludeUid={program.uid}
        />
      )}

      <Footer />
    </div>
  );
};

export default ProgramPage;
