// @ts-nocheck
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, GraduationCap, ArrowRight, Globe, PauseCircle } from "lucide-react";
import useLocations from "hooks/locations/useLocations";
import type { Location } from "types/location";

/* ─── Animated counter ──────────────────────────────────────────────────── */

const useCountUp = (target: number, duration = 1400) => {
  const [value, setValue] = useState(0);
  const ref    = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!inView || target === 0) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setValue(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);

  return { value, ref };
};

/* ─── Stat block ────────────────────────────────────────────────────────── */

const Stat = ({ target, label, accent = false }: { target: number; label: string; accent?: boolean }) => {
  const { value, ref } = useCountUp(target);
  return (
    <div className="text-center">
      <p ref={ref} className={`text-3xl md:text-4xl font-extrabold tabular-nums ${accent ? "text-gold-500" : "text-navy-800"}`}>
        {value}
      </p>
      <p className="text-slate-400 text-xs mt-1.5 uppercase tracking-widest font-medium">{label}</p>
    </div>
  );
};

/* ─── Location card ─────────────────────────────────────────────────────── */

const LocationCard = ({ location }: { location: Location }) => (
  <motion.div
    whileHover={{ y: -4, scale: 1.02 }}
    transition={{ duration: 0.2, ease: "easeOut" }}
    className="group relative flex-shrink-0 w-60 bg-white border border-slate-100 hover:border-gold-300 rounded-2xl p-5 transition-colors duration-300 hover:shadow-[0_8px_28px_rgba(201,168,76,0.12)] cursor-default select-none"
  >
    {/* Active pulse dot */}
    {location.is_active && (
      <span className="absolute top-4 right-4 flex items-center justify-center">
        <span className="absolute w-3 h-3 rounded-full bg-gold-400/40 animate-ping" />
        <span className="w-2 h-2 rounded-full bg-gold-500" />
      </span>
    )}

    {/* Pin icon */}
    <div className="w-10 h-10 rounded-xl bg-navy-50 border border-navy-100 flex items-center justify-center mb-4 group-hover:bg-gold-50 group-hover:border-gold-200 transition-colors duration-300">
      <MapPin size={17} className="text-navy-600 group-hover:text-gold-500 transition-colors duration-300" />
    </div>

    {/* Name */}
    <h3 className="text-navy-800 font-bold text-sm leading-snug pr-5 line-clamp-2 min-h-[36px]">
      {location.name}
    </h3>

    {/* Divider */}
    <div className="h-px bg-slate-100 my-3" />

    {/* Footer */}
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-1.5 text-slate-400 text-xs min-w-0">
        <Globe size={11} className="flex-shrink-0" />
        <span className="truncate">{location.city}, {location.country}</span>
      </div>
      <div className="flex items-center gap-1 text-gold-500 text-xs font-semibold flex-shrink-0">
        <GraduationCap size={13} />
        <span>{location.course_count ?? 0}</span>
      </div>
    </div>

    {/* Hover arrow */}
    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0">
      <ArrowRight size={13} className="text-gold-500" />
    </div>
  </motion.div>
);

/* ─── Skeleton card ─────────────────────────────────────────────────────── */

const SkeletonCard = () => (
  <div className="flex-shrink-0 w-60 h-[148px] rounded-2xl bg-slate-100 animate-pulse border border-slate-100" />
);

/* ─── Infinite carousel ─────────────────────────────────────────────────── */

const SPEED = 0.45;

const InfiniteCarousel = ({ locations }: { locations: Location[] }) => {
  const trackRef  = useRef<HTMLDivElement>(null);
  const posRef    = useRef(0);
  const pausedRef = useRef(false);
  const rafRef    = useRef<number>();
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || locations.length === 0) return;
    const animate = () => {
      if (!pausedRef.current) {
        posRef.current += SPEED;
        const half = track.scrollWidth / 2;
        if (posRef.current >= half) posRef.current = 0;
        track.style.transform = `translateX(-${posRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [locations]);

  const onEnter = () => { pausedRef.current = true;  setPaused(true);  };
  const onLeave = () => { pausedRef.current = false; setPaused(false); };

  return (
    <div className="relative overflow-hidden" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      {/* Gradient fade edges — match bg-slate-50 */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

      {/* Paused pill */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: paused ? 1 : 0, y: paused ? 0 : -6 }}
        transition={{ duration: 0.2 }}
        className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-navy-700 text-[10px] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full border border-slate-200 shadow-sm pointer-events-none"
      >
        <PauseCircle size={11} className="text-gold-500" />
        Paused
      </motion.div>

      {/* Track */}
      <div ref={trackRef} className="flex gap-4 w-max py-4 px-8" style={{ willChange: "transform" }}>
        {[...locations, ...locations].map((loc, i) => (
          <LocationCard key={`${loc.uid}-${i}`} location={loc} />
        ))}
      </div>
    </div>
  );
};

/* ─── Fade-up variant ───────────────────────────────────────────────────── */

const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: "easeOut", delay },
  }),
};

/* ─── Main section ──────────────────────────────────────────────────────── */

const Locations = () => {
  const { locations, loading, error } = useLocations({ is_active: true });

  const totalCourses    = locations.reduce((s, l) => s + (l.course_count ?? 0), 0);
  const uniqueCountries = new Set(locations.map((l) => l.country)).size;

  return (
    <section className="relative py-24 bg-slate-50 overflow-hidden">

      {/* Subtle decorative blobs */}
      <div className="absolute top-0 left-1/3 w-80 h-80 bg-gold-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-navy-100/30 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative max-w-6xl mx-auto px-6 text-center mb-14">

        <motion.div
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
        >
          <span className="text-gold-500 font-semibold text-sm uppercase tracking-widest">
            Global Presence
          </span>
        </motion.div>

        <motion.h2
          custom={0.08}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
          className="text-3xl md:text-4xl font-extrabold text-navy-800 mt-3 mb-3"
        >
          Training Centers{" "}
          <span className="text-gold-500">Worldwide</span>
        </motion.h2>

        <motion.p
          custom={0.16}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
          className="text-slate-500 max-w-md mx-auto text-sm leading-relaxed mb-12"
        >
          Premium venues across the Middle East, Europe, and Southeast Asia —
          built for professional excellence.
        </motion.p>

        {/* Stats row */}
        <motion.div
          custom={0.24}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
          className="inline-flex items-center gap-10 md:gap-16 bg-white border border-slate-100 rounded-2xl px-10 py-6 shadow-sm"
        >
          <Stat target={locations.length} label="Locations" />
          <div className="w-px h-10 bg-slate-100" />
          <Stat target={totalCourses} label="Programs" accent />
          <div className="w-px h-10 bg-slate-100" />
          <Stat target={uniqueCountries} label="Countries" />
        </motion.div>
      </div>

      {/* Carousel */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {loading ? (
          <div className="flex gap-4 px-8 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <p className="text-center text-red-400 text-sm py-10">{error}</p>
        ) : locations.length > 0 ? (
          <InfiniteCarousel locations={locations} />
        ) : null}
      </motion.div>

    </section>
  );
};

export default Locations;
