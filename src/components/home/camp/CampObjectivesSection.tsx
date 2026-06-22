// @ts-nocheck
import { motion } from "framer-motion";

const objectives = [
  "Build greater confidence, independence, and self-awareness.",
  "Develop leadership skills and a stronger sense of responsibility.",
  "Improve communication, presentation, and influencing skills.",
  "Expand participants' awareness of future skills.",
  "Introduce practical uses of artificial intelligence in learning and productivity.",
  "Encourage entrepreneurial thinking and turn ideas into initiatives.",
  "Help participants explore their academic and career pathways.",
];

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut", delay: d } }),
};

const CampObjectivesSection = () => (
  <section className="w-full bg-navy-900 py-20 lg:py-28 relative overflow-hidden">
    {/* Subtle grid overlay */}
    <div
      className="absolute inset-0 opacity-[0.03] pointer-events-none"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.8) 1px,transparent 1px)",
        backgroundSize: "48px 48px",
      }}
    />
    {/* Gold ambient glow */}
    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gold-500 opacity-[0.05] rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
    <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-navy-400 opacity-[0.08] rounded-full blur-3xl pointer-events-none translate-y-1/2" />

    <div className="relative max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">

      {/* Header — left/right split */}
      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true }}
        variants={fadeUp}
        className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-14"
      >
        <div>
          <span className="inline-block text-gold-400 text-[11px] font-bold uppercase tracking-[0.2em] mb-3">
            What We Aim For
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            Club Objectives
          </h2>
        </div>
        <p className="text-navy-300 text-sm sm:text-base max-w-sm lg:text-right leading-relaxed">
          Every element of the programme is designed with clear developmental goals in mind.
        </p>
      </motion.div>

      {/* Objectives grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {objectives.map((obj, i) => (
          <motion.div
            key={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={i * 0.04}
            variants={fadeUp}
            className="group relative flex items-start gap-4 bg-navy-800/60 border border-navy-700 hover:border-gold-500/40 hover:bg-navy-800 rounded-xl px-5 py-5 transition-all duration-200 overflow-hidden"
          >
            {/* Faded large number in background */}
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-8xl font-black text-white/[0.03] select-none pointer-events-none leading-none tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>

            {/* Number badge */}
            <span className="relative flex-shrink-0 w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/20 group-hover:bg-gold-500/15 group-hover:border-gold-500/35 flex items-center justify-center text-gold-400 font-bold text-xs transition-colors">
              {String(i + 1).padStart(2, "0")}
            </span>

            {/* Text */}
            <p className="relative text-sm text-navy-200 group-hover:text-white leading-relaxed pt-1 transition-colors">
              {obj}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default CampObjectivesSection;
