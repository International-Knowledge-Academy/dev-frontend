// @ts-nocheck
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Share2, MapPin, Users, Clock,
  Globe, CheckCircle2, Mail, Phone, Calendar, GraduationCap,
  BookOpen, Award, Briefcase, Monitor, LayoutGrid, Layers,
  ChevronRight, ArrowRight, FileText, Download, Check,
} from "lucide-react";
import { usePDF } from "@react-pdf/renderer";
import Navbar from "components/home/Navbar";
import Footer from "components/home/Footer";
import useGetProgram from "hooks/programs/useGetProgram";
import usePrograms from "hooks/programs/usePrograms";
import { useAppData } from "context/AppDataContext";
import ProgramCard from "components/programs/ProgramCard";
import ProgramQuotationPDF from "components/pdf/ProgramQuotationPDF";
import TestimonialsSection from "components/home/TestimonialsSection";
import LeadCaptureModal from "components/home/LeadCaptureModal";
import useSubscribeEmail from "hooks/emails/useSubscribeEmail";
import type { ProgramTrainer } from "types/program";

/* ─── Config maps ────────────────────────────────────────────────────────── */

const typeConfig = {
  course:     { label: "Training Course",    Icon: BookOpen,  bg: "bg-navy-50",   text: "text-navy-700",  border: "border-navy-200"  },
  diploma:    { label: "Training Diploma",   Icon: Award,     bg: "bg-gold-50",   text: "text-gold-700",  border: "border-gold-200"  },
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
  <div className="border-b border-slate-100 pb-6">
    <h3 className="flex items-center gap-2 text-[11px] font-bold text-navy-800 uppercase tracking-widest mb-5">
      <Icon size={14} className={iconColor} aria-hidden="true" />
      {title}
    </h3>
    {children}
  </div>
);

/* ─── Trainer card ───────────────────────────────────────────────────────── */

const TrainerCard = ({ trainer }: { trainer: ProgramTrainer }) => (
  <div className="flex gap-4 p-4 rounded-xl border border-slate-100 hover:border-gold-200 hover:shadow-sm transition-all duration-200 group">
    {trainer.profile_picture?.public_url ? (
      <img
        src={trainer.profile_picture.public_url}
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
  fieldUid, fieldName, excludeUid,
}: { fieldUid: string; fieldName: string; excludeUid: string }) => {
  const { programs, loading } = usePrograms({ field: fieldUid, is_active: true });
  const related = programs.filter((p) => p.uid !== excludeUid).slice(0, 3);
  if (!loading && related.length === 0) return null;

  return (
    <section className="border-t border-slate-100 bg-white">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2
              className="text-xl font-extrabold text-navy-800"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Related Programs
            </h2>
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

        <div className="sm:hidden mt-6 text-center">
          <Link
            to={`/programs?field=${fieldUid}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-600 hover:text-gold-600 transition-colors"
          >
            View all programs <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
};

/* ─── Quotation download button ──────────────────────────────────────────── */

const QuotationDownloadButton = ({
  program,
  variant = "default",
}: {
  program: any;
  variant?: "default" | "hero";
}) => {
  const { locations } = useAppData();
  const [downloaded, setDownloaded]   = useState(false);
  const [showModal, setShowModal]     = useState(false);
  const [instance] = usePDF({ document: <ProgramQuotationPDF program={program} locations={locations} /> });
  const { subscribe, loading: subscribing } = useSubscribeEmail();

  const triggerDownload = () => {
    if (!instance.url) return;
    const a = document.createElement("a");
    a.href = instance.url;
    a.download = `IKA-Quotation-${program.name.replace(/\s+/g, "-")}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  const handleButtonClick = () => {
    if (instance.loading) return;
    setShowModal(true);
  };

  const handleModalSubmit = async (email: string, phone: string) => {
    setShowModal(false);
    triggerDownload();
    subscribe(email, phone);
  };

  const handleModalSkip = () => {
    setShowModal(false);
    triggerDownload();
  };

  return (
    <>
      <LeadCaptureModal
        open={showModal}
        onSubmit={handleModalSubmit}
        onSkip={handleModalSkip}
        loading={subscribing}
      />

      {variant === "hero" ? (
        <button
          type="button"
          onClick={handleButtonClick}
          disabled={instance.loading}
          className="inline-flex items-center gap-2.5 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold px-8 py-3.5 rounded-md lg:rounded-lg text-sm transition-all duration-200 shadow-lg hover:shadow-gold-500/25 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {downloaded ? (
            <><Check size={16} className="text-navy-800" /> Downloaded!</>
          ) : instance.loading ? (
            <><FileText size={16} /> Preparing PDF…</>
          ) : (
            <><Download size={16} /> Download Quotation PDF</>
          )}
        </button>
      ) : (
        <button
          type="button"
          onClick={handleButtonClick}
          disabled={instance.loading}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-slate-700 hover:bg-slate-800 border border-slate-600 px-3 py-2 rounded-md lg:rounded-lg transition-all duration-200 disabled:opacity-60"
        >
          {downloaded ? (
            <><Check size={12} /> Done</>
          ) : instance.loading ? (
            <><FileText size={12} /> Preparing…</>
          ) : (
            <><FileText size={12} /> Download Quotation</>
          )}
        </button>
      )}
    </>
  );
};

/* ─── Main page ──────────────────────────────────────────────────────────── */

const ProgramPage = () => {
  const { uid }  = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const { program, loading, error } = useGetProgram(uid);

  /* ── Skeleton loader ─────────────────────────────────────────────────── */
  if (loading) return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="relative mt-[80px] sm:mt-[100px] lg:mt-[120px] bg-navy-900 px-6 pt-10 pb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.8) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.8) 1px,transparent 1px)", backgroundSize: "48px 48px" }} />
        <div className="max-w-6xl mx-auto animate-pulse">
          <div className="h-4 w-12 rounded bg-navy-700 mb-8" />
          <div className="flex gap-2 mb-5">
            <div className="h-6 w-24 rounded-full bg-navy-700" />
            <div className="h-6 w-20 rounded-full bg-navy-700" />
          </div>
          <div className="h-12 w-3/4 rounded-xl bg-navy-700 mb-3" />
          <div className="h-12 w-1/2 rounded-xl bg-navy-700 mb-5" />
          <div className="h-4 w-full max-w-2xl rounded bg-navy-700 mb-2" />
          <div className="h-4 w-2/3 max-w-xl rounded bg-navy-700 mb-8" />
          <div className="flex flex-wrap gap-3 mb-8">
            {[80, 96, 72, 88].map((w, i) => (
              <div key={i} className="h-16 rounded-xl bg-navy-700" style={{ width: w }} />
            ))}
          </div>
          <div className="flex gap-3">
            <div className="h-11 w-36 rounded-lg bg-gold-600/30" />
            <div className="h-11 w-28 rounded-lg bg-navy-700" />
          </div>
        </div>
      </div>
      <div className="flex-1 max-w-6xl mx-auto w-full px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse">
                <div className="h-3.5 w-32 rounded bg-slate-200 mb-5" />
                <div className="space-y-2.5">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-3 rounded bg-slate-100" style={{ width: `${90 - j * 8}%` }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-5">
            <div className="bg-navy-900 rounded-2xl p-6 animate-pulse">
              <div className="h-3 w-20 rounded bg-navy-700 mb-3" />
              <div className="h-9 w-32 rounded-lg bg-navy-700 mb-2" />
              <div className="h-3 w-24 rounded bg-navy-700 mb-6" />
              <div className="h-11 w-full rounded-lg bg-gold-500/20 mb-2" />
              <div className="h-9 w-full rounded-lg bg-navy-700" />
            </div>
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse">
                <div className="h-3 w-24 rounded bg-slate-200 mb-4" />
                <div className="space-y-3">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-3 rounded bg-slate-100" style={{ width: `${100 - j * 15}%` }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );

  /* ── Error / not found ────────────────────────────────────────────────── */
  if (error || !program) {
    const isNotFound = !program || error?.includes("404") || error?.toLowerCase().includes("not found");
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
          <div className="w-20 h-20 rounded-full bg-navy-50 border border-navy-100 flex items-center justify-center mb-6">
            <BookOpen size={32} className="text-navy-300" />
          </div>
          <h1
            className="text-2xl font-extrabold text-navy-800 mb-3"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {isNotFound ? "Program Not Found" : "Something Went Wrong"}
          </h1>
          <p className="text-slate-500 text-sm max-w-sm leading-relaxed mb-8">
            {isNotFound
              ? "This program may have been removed, renamed, or is no longer available."
              : (error ?? "We couldn't load this program. Please try again.")}
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 border border-slate-200 hover:border-navy-300 text-navy-700 font-semibold text-sm px-5 py-2.5 rounded-full transition-all duration-200"
            >
              <ArrowLeft size={14} /> Go Back
            </button>
            <button
              type="button"
              onClick={() => navigate("/programs")}
              className="inline-flex items-center gap-2 bg-navy-800 hover:bg-gold-500 hover:text-navy-900 text-white font-bold text-sm px-6 py-2.5 rounded-full transition-all duration-200"
            >
              Browse Programs <ArrowRight size={14} />
            </button>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-100 max-w-sm w-full">
            <p className="text-xs text-slate-400 mb-4">Looking for something specific?</p>
            <button
              type="button"
              onClick={() => navigate("/contact")}
              className="text-xs font-semibold text-navy-600 hover:text-gold-600 transition-colors"
            >
              Contact our team →
            </button>
          </div>
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
    <div className="min-h-screen bg-[#F8F5F0] flex flex-col">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative mt-[80px] sm:mt-[100px] lg:mt-[120px] bg-navy-900 overflow-hidden">

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* Blobs */}
        <div className="absolute top-0 right-0 w-[520px] h-[520px] bg-gold-500 opacity-[0.07] rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-[320px] h-[320px] bg-navy-400 opacity-[0.08] rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 pt-10 pb-16">

          {/* Top bar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-between mb-8"
          >
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-navy-300 hover:text-white text-sm font-medium transition-colors duration-200 group"
            >
              <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
              Back
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleShare(program.name)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-300 hover:text-white border border-navy-600 hover:border-navy-500 px-3 py-2 rounded-md lg:rounded-lg transition-all duration-200"
              >
                <Share2 size={12} /> Share
              </button>
              <QuotationDownloadButton program={program} />
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
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border border-white/10 bg-white/10 text-white">
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

          {/* Title — Playfair Display */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4 max-w-3xl"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
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

          {/* Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="flex flex-wrap gap-3 mb-8"
          >
            {startDate && (
              <div className="flex items-center gap-2.5 bg-navy-800/80 border border-navy-700 rounded-xl px-4 py-3">
                <Calendar size={14} className="text-gold-400 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-navy-400 uppercase tracking-widest font-semibold leading-none mb-1">Starts</p>
                  <p className="text-sm font-bold text-white leading-none">{startDate}</p>
                </div>
              </div>
            )}
            {program.duration && (
              <div className="flex items-center gap-2.5 bg-navy-800/80 border border-navy-700 rounded-xl px-4 py-3">
                <Clock size={14} className="text-gold-400 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-navy-400 uppercase tracking-widest font-semibold leading-none mb-1">Duration</p>
                  <p className="text-sm font-bold text-white leading-none">{program.duration}</p>
                </div>
              </div>
            )}
            {program.max_participants && (
              <div className="flex items-center gap-2.5 bg-navy-800/80 border border-navy-700 rounded-xl px-4 py-3">
                <Users size={14} className="text-gold-400 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-navy-400 uppercase tracking-widest font-semibold leading-none mb-1">Seats</p>
                  <p className="text-sm font-bold text-white leading-none">{program.max_participants}</p>
                </div>
              </div>
            )}
            {program.language && (
              <div className="flex items-center gap-2.5 bg-navy-800/80 border border-navy-700 rounded-xl px-4 py-3">
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
              onClick={() => navigate(`/register?uid=${program.uid}`)}
              className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold px-8 py-3 rounded-md lg:rounded-lg text-sm transition-all duration-200 shadow-lg hover:shadow-gold-500/25 hover:-translate-y-0.5"
            >
              Enroll Now <ChevronRight size={15} />
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* ── Left column ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Content card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 space-y-6"
            >
              {/* Thumbnail — full-bleed header inside card */}
              {program.thumbnail?.public_url && (
                <div className="-mx-6 -mt-6 mb-2 rounded-t-2xl overflow-hidden">
                  <img
                    src={program.thumbnail.public_url}
                    alt={program.name}
                    className="w-full h-56 sm:h-72 md:h-80 object-cover"
                  />
                </div>
              )}

              {program.description && (
                <SectionCard title="About This Program" icon={BookOpen}>
                  <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-wrap">{program.description}</p>
                </SectionCard>
              )}

              {objectives.length > 0 && (
                <SectionCard title="Program Objectives" iconColor="text-emerald-500">
                  <ul className="space-y-3">
                    {objectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                        <span className="text-slate-600 text-sm leading-relaxed">{obj}</span>
                      </li>
                    ))}
                  </ul>
                </SectionCard>
              )}

              {program.target_audience && (
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
                    <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{program.target_audience}</p>
                  )}
                </SectionCard>
              )}

              {program.prerequisites && (
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
                    <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{program.prerequisites}</p>
                  )}
                </SectionCard>
              )}

              {(startDate || endDate) && (
                <SectionCard title="Training Schedule" icon={Calendar}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              )}

              {program.trainer_profiles?.length > 0 && (
                <SectionCard title="Your Trainers" icon={GraduationCap} iconColor="text-navy-600">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {program.trainer_profiles.map((trainer) => (
                      <TrainerCard key={trainer.uid} trainer={trainer} />
                    ))}
                  </div>
                </SectionCard>
              )}
            </motion.div>
          </div>

          {/* ── Sticky sidebar ── */}
          <div className="space-y-5 lg:sticky lg:top-36 lg:self-start">

            {/* Enroll card */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative bg-navy-900 rounded-2xl p-6 text-white shadow-lg overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-300" />
              <div className="w-10 h-10 rounded-lg bg-gold-500/20 flex items-center justify-center mb-4">
                <GraduationCap size={20} className="text-gold-400" />
              </div>
              <p
                className="font-bold text-base mb-1.5"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Ready to enroll?
              </p>
              <p className="text-navy-300 text-xs leading-relaxed mb-5">
                Contact our team to learn more and reserve your seat.
              </p>
              {startDate && (
                <div className="flex items-center gap-2 text-xs text-navy-300 mb-5">
                  <Calendar size={12} className="text-gold-400 flex-shrink-0" />
                  Starts {startDate}
                </div>
              )}
              <button
                onClick={() => navigate(`/register?uid=${program.uid}`)}
                className="w-full bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold py-3 rounded-md lg:rounded-lg text-sm transition-all duration-200 mb-2.5"
              >
                Register Now
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="w-full border border-navy-700 hover:border-navy-600 text-navy-300 hover:text-white font-semibold py-2.5 rounded-md lg:rounded-lg text-xs transition-all duration-200"
              >
                Request More Info
              </button>
            </motion.div>

            {/* Location */}
            {program.location && (
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm"
              >
                <h3 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">
                  <MapPin size={13} className="text-gold-500" /> Location
                </h3>
                <p className="font-bold text-navy-800 text-sm mb-1">{program.location.name}</p>
                {program.location.address && (
                  <p className="text-xs text-slate-500 leading-relaxed mb-0.5">{program.location.address}</p>
                )}
                <p className="text-xs text-slate-500">
                  {[program.location.city, program.location.country].filter(Boolean).join(", ")}
                </p>
                {program.location.contact_phone && (
                  <a href={`tel:${program.location.contact_phone}`} className="flex items-center gap-2 mt-3 text-xs text-navy-600 hover:text-gold-600 transition-colors">
                    <Phone size={12} className="text-gold-500" />
                    {program.location.contact_phone}
                  </a>
                )}
                {program.location.venue_details && (
                  <p className="text-xs text-slate-400 mt-3 leading-relaxed border-t border-slate-100 pt-3">
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
              className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm"
            >
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Program Details</h3>
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
                className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm space-y-3"
              >
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Contact</h3>
                {program.contact_email && (
                  <a href={`mailto:${program.contact_email}`} className="flex items-center gap-3 hover:text-gold-600 transition-colors group">
                    <Mail size={15} className="text-gold-500 flex-shrink-0" />
                    <span className="text-xs text-navy-700 group-hover:text-gold-600 truncate transition-colors">{program.contact_email}</span>
                  </a>
                )}
                {program.contact_phone && (
                  <a href={`tel:${program.contact_phone}`} className="flex items-center gap-3 hover:text-gold-600 transition-colors group">
                    <Phone size={15} className="text-gold-500 flex-shrink-0" />
                    <span className="text-xs text-navy-700 group-hover:text-gold-600 transition-colors">{program.contact_phone}</span>
                  </a>
                )}
              </motion.div>
            )}

            {/* Share */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm"
            >
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Share</h3>
              <button
                onClick={() => handleShare(program.name)}
                className="w-full flex items-center justify-center gap-2 border border-slate-200 hover:border-navy-300 hover:bg-navy-50 text-navy-700 font-semibold py-2.5 rounded-md lg:rounded-lg text-xs transition-all duration-200"
              >
                <Share2 size={12} /> Copy Link
              </button>
            </motion.div>
          </div>

        </div>
      </div>

      {/* ── Quotation download — single, polished CTA ────────────────────── */}
      <section className="relative bg-navy-900 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.8) 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold-500 opacity-[0.06] rounded-full blur-3xl translate-x-1/3 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-navy-400 opacity-[0.08] rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 py-14">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-xl bg-gold-500/15 border border-gold-500/20 flex items-center justify-center flex-shrink-0">
                <FileText size={24} className="text-gold-400" />
              </div>
              <div>
                <p className="text-[10px] text-navy-400 uppercase tracking-widest font-semibold mb-1.5">
                  Official Document
                </p>
                <h2
                  className="text-xl font-extrabold text-white mb-2"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Download Program Quotation
                </h2>
                <p className="text-navy-300 text-sm leading-relaxed max-w-lg">
                  Get the full program details, schedule, objectives, and overview in a professionally
                  formatted PDF document ready to share with your organization.
                </p>
              </div>
            </div>
            <div className="flex-shrink-0 flex flex-col items-center gap-3">
              <QuotationDownloadButton program={program} variant="hero" />
              <p className="text-navy-500 text-[10px]">Free · No sign-in required</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <TestimonialsSection programUid={program.uid} />

      {/* ── Related programs ─────────────────────────────────────────────── */}
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
