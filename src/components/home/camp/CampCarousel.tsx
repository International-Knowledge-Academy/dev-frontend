// @ts-nocheck
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Download, Users, Clock, MapPin } from "lucide-react";

import campImg1 from "assets/img/camp/Gulf Young 1.png";
import campImg2 from "assets/img/camp/Gulf Young 2.png";

/* ── slides ──────────────────────────────────────────────────────────────── */
const slides = [
  {
    id:          "overview",
    badge:       "IKA · Malaysia 2026",
    title:       ["Gulf Young", "Leaders Club"],
    description: "A carefully designed international experience for Gulf youth — combining leadership training, future skills, educational visits, and adventure in Malaysia.",
    image:       campImg1,
  },
  {
    id:          "youth",
    badge:       "Ages 16–18  ·  12–23 July 2026",
    title:       ["Gulf Youth", "Club"],
    description: "Confidence building, personal development, leadership, and university readiness in an organised, engaging, and internationally oriented environment.",
    image:       campImg2,
    tags:        ["Leadership", "Confidence", "Future Skills", "Teamwork", "University Readiness"],
  },
  {
    id:          "leaders",
    badge:       "Ages 19–22  ·  26 July – 6 Aug 2026",
    title:       ["Gulf Future", "Leaders Club"],
    description: "Advanced leadership, career planning, artificial intelligence, entrepreneurship, and building future-focused initiatives and projects.",
    image:       campImg1,
    tags:        ["Advanced Leadership", "AI", "Entrepreneurship", "Career Planning", "Innovation"],
  },
];

/* ── animation ───────────────────────────────────────────────────────────── */
const textVariants = {
  enter:  (dir: number) => ({ x: dir > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  exit:   (dir: number) => ({ x: dir > 0 ? -48 : 48, opacity: 0, transition: { duration: 0.3, ease: "easeIn" } }),
};

const fadeUp = {
  hidden:  { opacity: 0, y: 14 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: d } }),
};

/* ── main carousel ───────────────────────────────────────────────────────── */
const CampCarousel = ({ brochureUrl = "#" }: { brochureUrl?: string }) => {
  const [index, setIndex]   = useState(0);
  const [dir, setDir]       = useState(1);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((next: number, direction: number) => {
    setDir(direction);
    setIndex(next);
  }, []);

  const prev = () => goTo((index - 1 + slides.length) % slides.length, -1);
  const next = () => goTo((index + 1) % slides.length, 1);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setDir(1);
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, [paused]);

  const slide = slides[index];

  return (
    <section
      className="relative w-full min-h-screen overflow-hidden bg-navy-900 flex flex-col"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >

      <AnimatePresence mode="wait">
        <motion.div
          key={"bg-" + slide.id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        >
          <img
            src={slide.image}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
          />
          {/* left-heavy gradient keeps text legible */}
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900/95 via-navy-900/80 to-navy-900/40" />
          {/* top + bottom fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-navy-900/50" />
        </motion.div>
      </AnimatePresence>

      {/* ── Foreground content ── */}
      <div className="relative z-10 flex-1 flex flex-col max-w-6xl mx-auto w-full px-6 sm:px-8 lg:px-10 pt-[110px] sm:pt-[130px] lg:pt-[160px] pb-14 lg:pb-20">

        {/* Slide text */}
        <div className="flex-1 flex items-center">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={slide.id}
              custom={dir}
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-2xl"
            >
              <motion.span
                variants={fadeUp} initial="hidden" animate="visible" custom={0}
                className="inline-block text-[11px] font-bold uppercase tracking-[0.18em] text-gold-400 mb-4"
              >
                {slide.badge}
              </motion.span>

              <motion.h2
                variants={fadeUp} initial="hidden" animate="visible" custom={0.07}
                className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] mb-5"
              >
                {slide.title[0]}
                <span className="block text-gold-400">{slide.title[1]}</span>
              </motion.h2>

              <motion.p
                variants={fadeUp} initial="hidden" animate="visible" custom={0.14}
                className="text-white/75 text-base sm:text-lg leading-relaxed max-w-xl mb-6"
              >
                {slide.description}
              </motion.p>

              {/* Stats strip — overview slide only */}
              {slide.id === "overview" && (
                <motion.div
                  variants={fadeUp} initial="hidden" animate="visible" custom={0.19}
                  className="flex flex-wrap gap-3 mb-7"
                >
                  {[
                    { value: "12",    label: "Days per programme", icon: Clock  },
                    { value: "20",    label: "Seats per club",    icon: Users  },
                    { value: "4",     label: "Gulf countries",     icon: MapPin },
                  ].map(({ value, label, icon: Icon }) => (
                    <div
                      key={label}
                      className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2"
                    >
                      <Icon size={13} className="text-gold-400 flex-shrink-0" />
                      <span className="text-gold-300 font-bold text-sm">{value}</span>
                      <span className="text-white/60 text-xs">{label}</span>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Focus area tags — camp slides */}
              {slide.tags && (
                <motion.div
                  variants={fadeUp} initial="hidden" animate="visible" custom={0.19}
                  className="flex flex-wrap gap-2 mb-7"
                >
                  {slide.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white/80"
                    >
                      {tag}
                    </span>
                  ))}
                </motion.div>
              )}

              {/* CTAs */}
              <motion.div
                variants={fadeUp} initial="hidden" animate="visible" custom={0.24}
                className="flex flex-wrap gap-3"
              >
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to={slide.id === "corporate" ? "/programs" : "/register/club"}
                    className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold px-6 py-3 rounded-md lg:rounded-lg text-sm transition-colors duration-200"
                  >
                    {slide.id === "corporate"
                      ? "Explore Our Programs"
                      : "Register for Club"}
                  </Link>
                </motion.div>

                {slide.id === "overview" && (
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <a
                      href={brochureUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 border border-white/30 text-white hover:border-gold-400 hover:text-gold-400 font-semibold px-6 py-3 rounded-md lg:rounded-lg text-sm transition-all duration-200 backdrop-blur-sm"
                    >
                      <Download size={14} /> Download Brochure
                    </a>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Controls ── */}
        <div className="flex items-center justify-between mt-10">
          {/* Dots */}
          <div className="flex gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => goTo(i, i > index ? 1 : -1)}
                className="relative h-1.5 rounded-full overflow-hidden transition-all duration-300 focus:outline-none"
                style={{ width: i === index ? 32 : 10, background: i === index ? "transparent" : "rgba(255,255,255,0.25)" }}
                aria-label={`Go to slide ${i + 1}`}
              >
                {i === index && (
                  <motion.span
                    key={`dot-${index}`}
                    className="absolute inset-0 bg-gold-400 rounded-full origin-left"
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
              type="button" onClick={prev}
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.93 }}
              className="w-10 h-10 rounded-lg border border-white/25 text-white/70 hover:border-gold-400 hover:text-gold-400 flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
              aria-label="Previous slide"
            >
              <ChevronLeft size={18} />
            </motion.button>
            <motion.button
              type="button" onClick={next}
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.93 }}
              className="w-10 h-10 rounded-lg border border-white/25 text-white/70 hover:border-gold-400 hover:text-gold-400 flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
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
