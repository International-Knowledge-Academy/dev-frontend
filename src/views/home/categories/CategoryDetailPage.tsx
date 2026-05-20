// @ts-nocheck
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Share2, BookOpen, GraduationCap, Users,
  ArrowRight, LayoutGrid, Layers, ChevronRight,
} from "lucide-react";
import Navbar from "components/home/Navbar";
import Footer from "components/home/Footer";
import useGetCategory from "hooks/categories/useGetCategory";
import useCategoryFields from "hooks/categories/useCategoryFields";
import type { Field } from "types/field";

/* ─── Animation variants ─────────────────────────────────────────────────── */

const container = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const cardVariant = {
  hidden:  { opacity: 0, y: 20, scale: 0.97 },
  visible: { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

/* ─── Helpers ────────────────────────────────────────────────────────────── */

const handleShare = async (title: string) => {
  if (navigator.share) {
    await navigator.share({ title, url: window.location.href }).catch(() => {});
  } else {
    await navigator.clipboard.writeText(window.location.href).catch(() => {});
  }
};

/* ─── Skeleton ───────────────────────────────────────────────────────────── */

const SkeletonHero = () => (
  <div className="bg-navy-800 px-6 pt-8 pb-16">
    <div className="max-w-6xl mx-auto space-y-4 animate-pulse">
      <div className="h-4 w-20 rounded bg-navy-600" />
      <div className="flex gap-2 pt-1">
        <div className="h-6 w-32 rounded-full bg-navy-600" />
      </div>
      <div className="h-10 w-2/3 rounded-xl bg-navy-600" />
      <div className="h-4 w-1/2 rounded bg-navy-600" />
      <div className="flex flex-wrap gap-3 pt-2">
        {[1, 2].map((i) => (
          <div key={i} className="h-16 w-36 rounded-xl bg-navy-700" />
        ))}
      </div>
      <div className="flex gap-3 pt-1">
        <div className="h-11 w-36 rounded-md bg-gold-600/40" />
      </div>
    </div>
  </div>
);

const SkeletonCard = () => (
  <div className="relative rounded-2xl bg-white border border-slate-100 overflow-hidden animate-pulse">
    <div className="h-2 bg-slate-200 w-full" />
    <div className="p-6">
      <div className="w-11 h-11 rounded-xl bg-slate-100 mb-4" />
      <div className="h-5 w-3/4 rounded-lg bg-slate-100 mb-3" />
      <div className="h-3.5 w-full  rounded bg-slate-100 mb-2" />
      <div className="h-3.5 w-5/6  rounded bg-slate-100 mb-6" />
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="h-3.5 w-20 rounded bg-slate-100" />
        <div className="h-3.5 w-14 rounded bg-slate-100" />
      </div>
    </div>
  </div>
);

/* ─── Field card ─────────────────────────────────────────────────────────── */

const FieldCard = ({ field }: { field: Field }) => {
  const accent       = field.hex_color || "#1B2A5E";
  const hasThumbnail = !!field.thumbnail?.public_url;

  return (
    <motion.div
      variants={cardVariant}
      whileHover={{ y: -5, transition: { duration: 0.2, ease: "easeOut" } }}
      style={{ borderColor: `${accent}55` }}
      className="group bg-white border rounded-2xl overflow-hidden flex flex-col transition-all duration-300"
    >
      {hasThumbnail ? (
        <div className="h-44 overflow-hidden flex-shrink-0">
          <img
            src={field.thumbnail.public_url}
            alt={field.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      ) : (
        <div className="h-1.5 w-full flex-shrink-0" style={{ backgroundColor: accent }} />
      )}

      <div className="p-6 flex flex-col flex-1">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 flex-shrink-0 transition-colors duration-300"
          style={{ backgroundColor: `${accent}18` }}
        >
          <GraduationCap size={20} style={{ color: accent }} />
        </div>

        <h3 className="text-navy-800 font-bold text-base leading-snug mb-2 line-clamp-2">
          {field.name}
        </h3>

        <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 flex-1 mb-5">
          {field.description || "Specialized training field with professional development programs."}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-navy-600 bg-navy-50 border border-navy-100 px-2.5 py-1 rounded-lg">
              <BookOpen size={11} />
              {field.program_count ?? 0} {field.program_count === 1 ? "program" : "programs"}
            </span>
            {field.trainers?.length > 0 && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400">
                <Users size={11} />
                {field.trainers.length}
              </span>
            )}
          </div>
          <Link
            to={`/programs?field=${field.uid}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 group-hover:text-gold-500 transition-colors duration-200"
          >
            Explore
            <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Main page ──────────────────────────────────────────────────────────── */

const CategoryDetailPage = () => {
  const { uid }      = useParams<{ uid: string }>();
  const navigate     = useNavigate();
  const { category, loading: loadingCat, error: catError } = useGetCategory(uid);
  const { fields, count, loading: loadingFields, error: fieldsError } = useCategoryFields(uid, {
    ordering: "display_order",
  });

  const loading        = loadingCat || loadingFields;
  const totalPrograms  = fields.reduce((sum, f) => sum + (f.program_count ?? 0), 0);
  const totalTrainers  = fields.reduce((acc, f) => {
    (f.trainers ?? []).forEach((t) => acc.add(t.uid));
    return acc;
  }, new Set()).size;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      {loadingCat ? <SkeletonHero /> : (
        <section className="relative mt-[80px] sm:mt-[100px] lg:mt-[120px] bg-navy-800 overflow-hidden">

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
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-500 opacity-[0.06] rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] bg-navy-400 opacity-[0.08] rounded-full blur-3xl pointer-events-none" />

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
              <button
                type="button"
                onClick={() => handleShare(category?.name ?? "Category")}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-300 hover:text-white border border-navy-600 hover:border-navy-500 px-3 py-2 rounded-md lg:rounded-lg transition-all duration-200"
              >
                <Share2 size={12} />
                Share
              </button>
            </motion.div>

            {catError || !category ? (
              <p className="text-red-400 text-sm">{catError ?? "Category not found."}</p>
            ) : (
              <>
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.05 }}
                  className="flex flex-wrap items-center gap-2 mb-5"
                >
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-navy-50 text-navy-700">
                    <Layers size={11} />
                    Training Category
                  </span>
                </motion.div>

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.1 }}
                  className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4 max-w-3xl"
                >
                  {category.name}
                </motion.h1>

                {/* Summary tagline */}
                {category.summary && (
                  <motion.p
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.18 }}
                    className="text-navy-300 text-base leading-relaxed max-w-2xl mb-8 line-clamp-2"
                  >
                    {category.summary}
                  </motion.p>
                )}

                {/* Metrics row */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.24 }}
                  className="flex flex-wrap gap-3 mb-8"
                >
                  <div className="flex items-center gap-2.5 bg-navy-700 border border-navy-600 rounded-xl px-4 py-3">
                    <LayoutGrid size={14} className="text-gold-400 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-navy-400 uppercase tracking-widest font-semibold leading-none mb-1">Fields</p>
                      <p className="text-sm font-bold text-white leading-none">
                        {loadingFields ? "—" : count}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 bg-navy-700 border border-navy-600 rounded-xl px-4 py-3">
                    <BookOpen size={14} className="text-gold-400 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-navy-400 uppercase tracking-widest font-semibold leading-none mb-1">Programs</p>
                      <p className="text-sm font-bold text-white leading-none">
                        {loadingFields ? "—" : totalPrograms}
                      </p>
                    </div>
                  </div>
                  {!loadingFields && totalTrainers > 0 && (
                    <div className="flex items-center gap-2.5 bg-navy-700 border border-navy-600 rounded-xl px-4 py-3">
                      <GraduationCap size={14} className="text-gold-400 flex-shrink-0" />
                      <div>
                        <p className="text-[10px] text-navy-400 uppercase tracking-widest font-semibold leading-none mb-1">Trainers</p>
                        <p className="text-sm font-bold text-white leading-none">{totalTrainers}</p>
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex flex-wrap items-center gap-3"
                >
                  <Link
                    to="/programs"
                    className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold px-8 py-3 rounded-md lg:rounded-lg text-sm transition-all duration-200 shadow-lg hover:shadow-gold-500/25 hover:-translate-y-0.5"
                  >
                    Browse Programs
                    <ChevronRight size={15} />
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 border border-navy-600 hover:border-navy-500 text-navy-300 hover:text-white font-semibold px-6 py-3 rounded-md lg:rounded-lg text-sm transition-all duration-200"
                  >
                    Get in Touch
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </section>
      )}

      {/* ── Fields grid ───────────────────────────────────────────────────── */}
      <section className="flex-1 max-w-6xl mx-auto w-full px-6 py-16">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h2 className="text-xl font-extrabold text-navy-800 mb-1">Training Fields</h2>
          <p className="text-slate-400 text-sm">Select a field to explore its programs and trainers.</p>
        </motion.div>

        {/* Error */}
        {(catError || fieldsError) && !loading && (
          <div className="flex items-center justify-center p-8 bg-red-50 border border-red-200 rounded-2xl">
            <p className="text-red-500 text-sm text-center">{catError || fieldsError}</p>
          </div>
        )}

        {/* Skeleton */}
        {loadingFields && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Empty */}
        {!loadingFields && !fieldsError && fields.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-100 rounded-2xl gap-3">
            <GraduationCap size={32} className="text-slate-300" />
            <p className="text-slate-400 text-sm">No fields available for this category yet.</p>
          </div>
        )}

        {/* Grid */}
        {!loadingFields && fields.length > 0 && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-20px" }}
            variants={container}
          >
            {fields.map((field) => (
              <FieldCard key={field.uid} field={field} />
            ))}
          </motion.div>
        )}

      </section>

      <Footer />
    </div>
  );
};

export default CategoryDetailPage;
