// @ts-nocheck
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight, Download, MessageCircle, CalendarCheck } from "lucide-react";

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut", delay: d } }),
};

const CampRegisterCTA = ({ brochureUrl = "#" }: { brochureUrl?: string }) => (
  <section className="py-20 lg:py-28 bg-navy-800 relative overflow-hidden">

    {/* Background glow */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#b8934a1a_0%,_transparent_70%)] pointer-events-none" />
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent" />
    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/20 to-transparent" />

    <div className="relative max-w-4xl mx-auto px-6 sm:px-8 lg:px-10 text-center">

      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true }}
        variants={fadeUp}
      >
        <span className="inline-flex items-center gap-2 bg-gold-500/10 border border-gold-500/25 text-gold-400 text-[11px] font-bold uppercase tracking-[0.2em] px-5 py-2.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
          Places Are Limited
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4">
          Start the<br />
          <span className="text-gold-400">Registration Journey</span>
        </h2>
        <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-4">
          Places are limited to ensure a high-quality experience and close supervision. Register your interest,
          contact the academy team, or book an initial admission interview.
        </p>
        <p className="text-slate-500 text-sm mb-10">
          The official brochure includes the full daily programme, courses, visits, activities, accommodation details, and registration offers.
        </p>
      </motion.div>

      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true }}
        variants={fadeUp} custom={0.15}
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <Link
          to="/register/camp"
          className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold px-7 py-3.5 rounded-md lg:rounded-lg text-sm transition-all duration-200 shadow-lg hover:-translate-y-0.5"
        >
          <ChevronRight size={15} />
          Register Your Interest
        </Link>

        <a
          href="https://wa.me/601168786103"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-gold-500/30 text-white hover:text-gold-300 font-semibold px-7 py-3.5 rounded-md lg:rounded-lg text-sm transition-all duration-200"
        >
          <MessageCircle size={15} />
          Contact the Academy Team
        </a>

        <a
          href={brochureUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-gold-500/30 text-white hover:text-gold-300 font-semibold px-7 py-3.5 rounded-md lg:rounded-lg text-sm transition-all duration-200"
        >
          <Download size={15} />
          Download the Brochure
        </a>
      </motion.div>

    </div>
  </section>
);

export default CampRegisterCTA;
