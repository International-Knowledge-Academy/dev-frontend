// @ts-nocheck
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight, Download, MapPin, Clock, Users } from "lucide-react";

const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut", delay: d } }),
};

const stats = [
  { icon: Clock,  value: "15 Days",         label: "Immersive Programme" },
  { icon: Users,  value: "20 – 25 Seats",   label: "Selective Cohort"    },
  { icon: MapPin, value: "4 Gulf Countries", label: "KSA · UAE · KW · QA" },
];

const CampHero = ({ brochureUrl = "#" }: { brochureUrl?: string }) => {
  return (
    <section className="relative min-h-screen flex items-center bg-navy-800 overflow-hidden">

      {/* Layered background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#b8934a22_0%,_transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_#0d1b3e33_0%,_transparent_70%)]" />

      {/* Decorative grid lines */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#b8934a 1px,transparent 1px),linear-gradient(90deg,#b8934a 1px,transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Gold top bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />

      {/* Floating orbs */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-gold-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-navy-700/30 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 py-28 lg:py-36">

        <div className="max-w-3xl">

          {/* Badge */}
          <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp} className="mb-6">
            <span className="inline-flex items-center gap-2 bg-gold-500/10 border border-gold-500/30 text-gold-400 text-[11px] font-bold uppercase tracking-[0.2em] px-5 py-2.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
              IKA Signature Programme · 2025
            </span>
          </motion.div>

          {/* Programme name */}
          <motion.h1
            initial="hidden"
            animate="visible"
            custom={0.1}
            variants={fadeUp}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-[1.1] tracking-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Gulf Young
            <span className="block text-gold-400 mt-1">Leaders Camp</span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial="hidden"
            animate="visible"
            custom={0.2}
            variants={fadeUp}
            className="mt-5 text-lg sm:text-xl font-semibold text-slate-300 tracking-wide"
          >
            Lead. Connect. Transform.
          </motion.p>

          {/* Description */}
          <motion.p
            initial="hidden"
            animate="visible"
            custom={0.3}
            variants={fadeUp}
            className="mt-5 text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl"
          >
            An intensive 15-day residential programme that brings together the next generation
            of Gulf leaders — equipping young professionals with the strategic mindset, cross-cultural
            fluency, and leadership toolkit needed to drive impact across the region.
          </motion.p>

          {/* Stat pills */}
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0.4}
            variants={fadeUp}
            className="flex flex-wrap gap-3 mt-8"
          >
            {stats.map(({ icon: Icon, value, label }) => (
              <div
                key={value}
                className="flex items-center gap-3 bg-white/5 border border-white/10 backdrop-blur-sm px-5 py-3 rounded-xl"
              >
                <div className="w-8 h-8 rounded-lg bg-gold-500/15 border border-gold-500/25 flex items-center justify-center flex-shrink-0">
                  <Icon size={15} className="text-gold-400" />
                </div>
                <div>
                  <p className="text-white font-extrabold text-sm leading-tight">{value}</p>
                  <p className="text-slate-500 text-[11px] font-medium leading-tight mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0.5}
            variants={fadeUp}
            className="flex flex-wrap items-center gap-4 mt-10"
          >
            <Link
              to="/register/camp"
              className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold px-7 py-3.5 rounded-md lg:rounded-lg text-sm transition-all duration-200 shadow-lg hover:-translate-y-0.5 hover:shadow-gold-500/25"
            >
              Register Your Interest
              <ChevronRight size={15} />
            </Link>

            <a
              href={brochureUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-gold-500/40 text-white hover:text-gold-300 font-semibold px-7 py-3.5 rounded-md lg:rounded-lg text-sm transition-all duration-200 backdrop-blur-sm"
            >
              <Download size={15} />
              Download Brochure
            </a>
          </motion.div>

        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-navy-800 to-transparent pointer-events-none" />

    </section>
  );
};

export default CampHero;
