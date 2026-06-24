// @ts-nocheck
import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";

import campImg1 from "assets/img/camp/Gulf Young 1.png";
import campImg2 from "assets/img/camp/Gulf Young 2.png";
import axiosInstance from "api/axiosInstance";
import useCamps from "hooks/camps/useCamps";
import useSubscribeEmail from "hooks/emails/useSubscribeEmail";
import LeadCaptureModal from "components/home/LeadCaptureModal";

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
const CampCarousel = () => {
  const [index, setIndex]   = useState(0);
  const [dir, setDir]       = useState(1);
  const [paused, setPaused] = useState(false);

  const { camps: allCamps } = useCamps();
  const slides = useMemo(() => {
    const open     = allCamps.filter((c) => c.status === "open");
    const upcoming = allCamps.filter((c) => c.status === "upcoming");
    return [...open, ...upcoming].map((camp, i) => {
      const badge = [
        camp.min_age != null && camp.max_age != null ? `Ages ${camp.min_age}–${camp.max_age}` : null,
        formatDateRange(camp.start_date, camp.end_date),
      ].filter(Boolean).join("  ·  ");

      return {
        id:          camp.uid,
        badge:       badge || "IKA · Malaysia 2026",
        title:       splitTitle(camp.name),
        description: camp.description ?? "",
        image:       CAMP_IMAGES[i % CAMP_IMAGES.length],
        tags:        parseHighlights(camp.highlights),
        brochure:    camp.brochure ?? null,
      };
    });
  }, [allCamps]);

  const goTo = useCallback((next: number, direction: number) => {
    setDir(direction);
    setIndex(next);
  }, []);

  const prev = () => goTo((index - 1 + slides.length) % slides.length, -1);
  const next = () => goTo((index + 1) % slides.length, 1);

  useEffect(() => {
    if (slides.length === 0) return;
    setIndex((i) => Math.max(0, Math.min(i, slides.length - 1)));
  }, [slides.length]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setDir(1);
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, [paused, slides.length]);

  const [brochureLoading, setBrochureLoading] = useState(false);
  const [showLeadModal, setShowLeadModal]     = useState(false);
  const { subscribe, loading: subscribing }   = useSubscribeEmail();

  if (slides.length === 0) return null;

  const slide = slides[index];

  const triggerBrochureDownload = async () => {
    if (!slide?.brochure) return;
    const win = window.open("", "_blank");
    setBrochureLoading(true);
    try {
      const { data } = await axiosInstance.get(`/camps/${slide.id}/brochure/download`);
      if (data.download_url && win) win.location.href = data.download_url;
      else if (win) win.close();
    } catch {
      if (win) win.close();
    } finally {
      setBrochureLoading(false);
    }
  };

  const handleBrochureClick = () => setShowLeadModal(true);

  const handleLeadSubmit = async (email: string, phone: string) => {
    setShowLeadModal(false);
    triggerBrochureDownload();
    subscribe(email, phone);
  };

  const handleLeadSkip = () => {
    setShowLeadModal(false);
  };

  return (
    <section
      className="relative w-full min-h-screen overflow-hidden bg-navy-900 flex flex-col"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <LeadCaptureModal
        open={showLeadModal}
        onSubmit={handleLeadSubmit}
        onSkip={handleLeadSkip}
        loading={subscribing}
        requirePhone
      />

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

              {/* CTAs */}
              <motion.div
                variants={fadeUp} initial="hidden" animate="visible" custom={0.24}
                className="flex flex-wrap gap-3"
              >
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/register/club"
                    className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold px-6 py-3 rounded-md lg:rounded-lg text-sm transition-colors duration-200"
                  >
                    Register for Club
                  </Link>
                </motion.div>

                {"brochure" in slide && slide.brochure && (
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <button
                      type="button"
                      onClick={handleBrochureClick}
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

export default CampCarousel;
