// @ts-nocheck
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Download, Calendar, Users, Clock, MapPin } from "lucide-react";

/* ── slides ──────────────────────────────────────────────────────────────── */
const slides = [
  {
    id:          "overview",
    badge:       "IKA · Malaysia 2026",
    title:       ["Gulf Young", "Leaders Camps"],
    description: "A carefully designed international experience for Gulf youth — combining leadership training, future skills, educational visits, and adventure in Malaysia.",
    visual:      "stats",
  },
  {
    id:          "youth",
    badge:       "Ages 16–18  ·  12–23 July 2026",
    title:       ["Gulf Youth", "Camp"],
    description: "Confidence building, personal development, leadership, and university readiness in an organised, engaging, and internationally oriented environment.",
    tags:        ["Leadership", "Confidence", "Future Skills", "Teamwork", "University Readiness"],
    visual:      "youth",
  },
  {
    id:          "leaders",
    badge:       "Ages 19–22  ·  26 July – 6 Aug 2026",
    title:       ["Gulf Future", "Leaders Camp"],
    description: "Advanced leadership, career planning, artificial intelligence, entrepreneurship, and building future-focused initiatives and projects.",
    tags:        ["Advanced Leadership", "AI", "Entrepreneurship", "Career Planning", "Innovation"],
    visual:      "leaders",
  },
];

/* ── animation ───────────────────────────────────────────────────────────── */
const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -60 : 60,
    opacity: 0,
    transition: { duration: 0.35, ease: "easeIn" },
  }),
};

const fadeUp = {
  hidden:  { opacity: 0, y: 16 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: d } }),
};

/* ── visual panels ───────────────────────────────────────────────────────── */
const OverviewVisual = () => (
  <div className="grid grid-cols-1 gap-4 w-full max-w-xs">
    {[
      { value: "12",    label: "Days per programme", icon: Clock  },
      { value: "20–25", label: "Seats per camp",     icon: Users  },
      { value: "4",     label: "Gulf countries",     icon: MapPin },
    ].map(({ value, label, icon: Icon }, i) => (
      <motion.div
        key={label}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 + 0.2 }}
        className="flex items-center gap-4 bg-navy-700 border border-navy-600 rounded-xl px-5 py-4"
      >
        <div className="w-9 h-9 rounded-lg bg-gold-900 border border-gold-700 flex items-center justify-center flex-shrink-0">
          <Icon size={16} className="text-gold-400" />
        </div>
        <div>
          <p className="text-gold-400 text-xl font-extrabold leading-none">{value}</p>
          <p className="text-navy-300 text-xs mt-0.5">{label}</p>
        </div>
      </motion.div>
    ))}
  </div>
);

const CampVisual = ({ tags, color }: { tags: string[]; color: "gold" | "navy" }) => (
  <div className="flex flex-col gap-3 w-full max-w-xs">
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.15 }}
      className="text-[11px] font-bold uppercase tracking-widest text-navy-400 mb-1"
    >
      Focus Areas
    </motion.p>
    {tags.map((tag, i) => (
      <motion.div
        key={tag}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: i * 0.07 + 0.15 }}
        className={`px-4 py-2.5 rounded-xl border text-sm font-semibold ${
          color === "gold"
            ? "bg-gold-900/60 border-gold-700 text-gold-300"
            : "bg-navy-700 border-navy-600 text-navy-200"
        }`}
      >
        {tag}
      </motion.div>
    ))}
  </div>
);

/* ── main carousel ───────────────────────────────────────────────────────── */
const CampCarousel = ({ brochureUrl = "#" }: { brochureUrl?: string }) => {
  const [index, setIndex]     = useState(0);
  const [dir, setDir]         = useState(1);
  const [paused, setPaused]   = useState(false);
  const intervalRef           = useRef<ReturnType<typeof setInterval>>(null);

  const goTo = useCallback((next: number, direction: number) => {
    setDir(direction);
    setIndex(next);
  }, []);

  const prev = () => goTo((index - 1 + slides.length) % slides.length, -1);
  const next = useCallback(() => goTo((index + 1) % slides.length, 1), [index, goTo]);

  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(next, 5000);
    return () => clearInterval(intervalRef.current);
  }, [paused, next]);

  const slide = slides[index];

  return (
    <section
      className="bg-navy-900 pt-[100px] sm:pt-[120px] lg:pt-[150px] pb-16 lg:pb-24 overflow-hidden relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">

        {/* Slide */}
        <div className="relative min-h-[380px] sm:min-h-[340px]">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={slide.id}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
            >
              {/* Left: text */}
              <div>
                <motion.span
                  variants={fadeUp} initial="hidden" animate="visible" custom={0}
                  className="inline-block text-[11px] font-bold uppercase tracking-[0.18em] text-gold-500 mb-4"
                >
                  {slide.badge}
                </motion.span>

                <motion.h2
                  variants={fadeUp} initial="hidden" animate="visible" custom={0.07}
                  className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-5"
                >
                  {slide.title[0]}
                  <span className="block text-gold-400">{slide.title[1]}</span>
                </motion.h2>

                <motion.p
                  variants={fadeUp} initial="hidden" animate="visible" custom={0.14}
                  className="text-navy-200 text-sm sm:text-base leading-relaxed max-w-lg mb-8"
                >
                  {slide.description}
                </motion.p>

                <motion.div
                  variants={fadeUp} initial="hidden" animate="visible" custom={0.2}
                  className="flex flex-wrap gap-3"
                >
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      to="/register/camp"
                      className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold px-6 py-3 rounded-md lg:rounded-lg text-sm transition-colors duration-200"
                    >
                      {slide.id === "overview" ? "Register Your Interest" : "Register for This Camp"}
                    </Link>
                  </motion.div>
                  {slide.id === "overview" && (
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      <a
                        href={brochureUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 border border-navy-500 text-navy-200 hover:border-gold-500 hover:text-gold-400 font-semibold px-6 py-3 rounded-md lg:rounded-lg text-sm transition-all duration-200"
                      >
                        <Download size={14} /> Download Brochure
                      </a>
                    </motion.div>
                  )}
                </motion.div>
              </div>

              {/* Right: visual */}
              <div className="hidden lg:flex justify-end">
                {slide.visual === "stats"   && <OverviewVisual />}
                {slide.visual === "youth"   && <CampVisual tags={slide.tags} color="navy" />}
                {slide.visual === "leaders" && <CampVisual tags={slide.tags} color="gold" />}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mt-10">

          {/* Dots */}
          <div className="flex gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => goTo(i, i > index ? 1 : -1)}
                className="relative h-1.5 rounded-full overflow-hidden transition-all duration-300 focus:outline-none"
                style={{ width: i === index ? 32 : 10, background: i === index ? "transparent" : "#162350" }}
                aria-label={`Go to slide ${i + 1}`}
              >
                {i === index && (
                  <motion.span
                    key={`dot-${index}`}
                    className="absolute inset-0 bg-gold-500 rounded-full origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: paused ? 0 : 5, ease: "linear" }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Arrows */}
          <div className="flex gap-2">
            <motion.button
              type="button"
              onClick={prev}
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.93 }}
              className="w-10 h-10 rounded-lg border border-navy-600 text-navy-300 hover:border-gold-500 hover:text-gold-400 flex items-center justify-center transition-all duration-200"
              aria-label="Previous slide"
            >
              <ChevronLeft size={18} />
            </motion.button>
            <motion.button
              type="button"
              onClick={next}
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.93 }}
              className="w-10 h-10 rounded-lg border border-navy-600 text-navy-300 hover:border-gold-500 hover:text-gold-400 flex items-center justify-center transition-all duration-200"
              aria-label="Next slide"
            >
              <ChevronRight size={18} />
            </motion.button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default CampCarousel;
