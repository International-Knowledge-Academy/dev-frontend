// @ts-nocheck
import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";

import campImg1 from "assets/img/camp/Gulf Young 1.png";
import campImg2 from "assets/img/camp/Gulf Young 2.png";
import ikaBg from "assets/img/camp/IKA-bg.png";
import useCamps from "hooks/camps/useCamps";
import usePresignedDownload from "hooks/storage/usePresignedDownload";

const CAMP_IMAGES = [campImg1, campImg2];

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
  return highlights.split(/[,\n]/).map((s) => s.trim()).filter(Boolean);
};

const splitTitle = (name: string): [string, string] => {
  const words = name.trim().split(" ");
  if (words.length === 1) return [words[0], ""];
  const last = words.pop();
  return [words.join(" "), last];
};

/* ── static slides ───────────────────────────────────────────────────────── */
const CORPORATE_SLIDE = {
  id:          "corporate",
  badge:       "IKA · Corporate Training",
  title:       ["Invest in Your Employees.", "Invest in Your Future."],
  description: "Empower your team with world-class training programmes in leadership, future skills, and professional development — tailored for organisations across the Gulf.",
  image:       ikaBg,
};

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
const CarouselHero = () => {
  const [index, setIndex]   = useState(0);
  const [dir, setDir]       = useState(1);
  const [paused, setPaused] = useState(false);

  const { camps: allCamps } = useCamps();
  const activeCamps = useMemo(() => {
    const open     = allCamps.filter((c) => c.status === "open");
    const upcoming = allCamps.filter((c) => c.status === "upcoming");
    return [...open, ...upcoming];
  }, [allCamps]);

  const slides = useMemo(() => [
    CORPORATE_SLIDE,
    ...activeCamps.map((camp, i) => {
      const badge = [
        camp.min_age != null && camp.max_age != null ? `Ages ${camp.min_age}–${camp.max_age}` : null,
        formatDateRange(camp.start_date, camp.end_date),
      ].filter(Boolean).join("  ·  ");

      return {
        id:       camp.uid,
        badge:    badge || "IKA · Malaysia 2026",
        title:    splitTitle(camp.name),
        description: camp.description ?? "",
        image:    CAMP_IMAGES[i % CAMP_IMAGES.length],
        tags:     parseHighlights(camp.highlights),
        brochure: camp.brochure ?? null,
        isOpen:   camp.status === "open",
      };
    }),
  ], [activeCamps]);

  const slide = slides[index];
  const { getDownloadUrl, loading: brochureLoading } = usePresignedDownload();

  const handleBrochureDownload = async () => {
    if (!slide?.brochure) return;
    const url = await getDownloadUrl(slide.brochure);
    if (url) window.open(url, "_blank");
  };

  const goTo = useCallback((next: number, direction: number) => {
    setDir(direction);
    setIndex(next);
  }, []);

  const prev = () => goTo((index - 1 + slides.length) % slides.length, -1);
  const next = () => goTo((index + 1) % slides.length, 1);

  useEffect(() => {
    setIndex((i) => Math.min(i, slides.length - 1));
  }, [slides.length]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setDir(1);
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, [paused, slides.length]);

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
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900/95 via-navy-900/80 to-navy-900/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-navy-900/50" />
        </motion.div>
      </AnimatePresence>

      {/* ── Foreground content ── */}
      <div className="relative z-10 flex-1 flex flex-col max-w-6xl mx-auto w-full px-6 sm:px-8 lg:px-10 pt-[110px] sm:pt-[130px] lg:pt-[160px] pb-14 lg:pb-20">

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
                {slide.title[1] && (
                  <span className="block text-gold-400">{slide.title[1]}</span>
                )}
              </motion.h2>

              {slide.description && (
                <motion.p
                  variants={fadeUp} initial="hidden" animate="visible" custom={0.14}
                  className="text-white/75 text-base sm:text-lg leading-relaxed max-w-xl mb-6"
                >
                  {slide.description}
                </motion.p>
              )}

              {/* Focus area tags — camp slides */}
              {slide.tags && slide.tags.length > 0 && (
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
                    {slide.id === "corporate" ? "Explore Our Programs" : "Register for This Club"}
                  </Link>
                </motion.div>

                {"brochure" in slide && slide.brochure && (
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <button
                      type="button"
                      onClick={handleBrochureDownload}
                      disabled={brochureLoading}
                      className="inline-flex items-center gap-2 border border-white/30 text-white hover:border-gold-400 hover:text-gold-400 font-semibold px-6 py-3 rounded-md lg:rounded-lg text-sm transition-all duration-200 backdrop-blur-sm disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <Download size={14} /> {brochureLoading ? "Preparing…" : "Download Brochure"}
                    </button>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Controls ── */}
        <div className="flex items-center justify-between mt-10">
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

export default CarouselHero;
