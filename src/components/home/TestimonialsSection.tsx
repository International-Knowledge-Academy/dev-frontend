// @ts-nocheck
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import useFeedbacks from "hooks/feedbacks/useFeedbacks";

/* ─── Helpers ────────────────────────────────────────────────────────────── */

const StarDisplay = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={13}
        className={s <= rating ? "text-gold-400 fill-gold-400" : "text-slate-200 fill-slate-200"}
      />
    ))}
  </div>
);

/* ─── Card ───────────────────────────────────────────────────────────────── */

const TestimonialCard = ({ fb, index }: { fb: any; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
    className="group bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col gap-4 hover:shadow-lg hover:border-gold-200 transition-all duration-300"
  >
    {/* Quote icon */}
    <div className="w-10 h-10 rounded-xl bg-navy-50 border border-navy-100 flex items-center justify-center flex-shrink-0 group-hover:bg-gold-50 group-hover:border-gold-200 transition-colors duration-300">
      <Quote size={18} className="text-navy-600 group-hover:text-gold-500 transition-colors duration-300" />
    </div>

    {/* Stars */}
    <StarDisplay rating={fb.rating} />

    {/* Message */}
    <p className="text-slate-600 text-sm leading-relaxed line-clamp-4 flex-1">
      "{fb.message}"
    </p>

    {/* Program badge */}
    {fb.program && (
      <span className="self-start inline-flex items-center text-[10px] font-semibold text-navy-600 bg-navy-50 border border-navy-100 px-2.5 py-1 rounded-full line-clamp-1">
        {fb.program.name}
      </span>
    )}

    {/* Author */}
    <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
      <div className="w-10 h-10 rounded-full bg-navy-800 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
        {fb.name?.[0]?.toUpperCase() ?? "?"}
      </div>
      <div className="min-w-0">
        <p className="font-bold text-navy-800 text-sm leading-tight truncate">{fb.name}</p>
        {fb.position && (
          <p className="text-xs text-slate-400 mt-0.5 truncate">{fb.position}</p>
        )}
      </div>
    </div>
  </motion.div>
);

/* ─── Section ────────────────────────────────────────────────────────────── */

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const TestimonialsSection = ({ programUid }: { programUid?: string }) => {
  const { feedbacks, loading } = useFeedbacks({
    page_size: 6,
    ...(programUid && { program__uid: programUid }),
  });

  if (loading || feedbacks.length === 0) return null;

  return (
    <section className="relative py-24 px-6 bg-slate-50 overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-20 left-1/4 w-[400px] h-[400px] bg-gold-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-[320px] h-[320px] bg-navy-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="text-gold-500 font-semibold text-sm uppercase tracking-widest">
            Testimonials
          </span>
          <h2
            className="text-4xl font-extrabold text-navy-800 mt-3"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            What Our Clients Say
          </h2>
          <p className="text-slate-500 mt-4 max-w-md mx-auto text-sm leading-relaxed">
            Real feedback from professionals who have completed our training programs.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={container}
        >
          {feedbacks.map((fb, i) => (
            <TestimonialCard key={fb.uid} fb={fb} index={i} />
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default TestimonialsSection;
