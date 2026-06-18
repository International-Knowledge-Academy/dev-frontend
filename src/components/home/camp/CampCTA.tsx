// @ts-nocheck
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight, Download, MessageCircle } from "lucide-react";

const CampCTA = ({ brochureUrl = "#" }: { brochureUrl?: string }) => (
  <section className="bg-navy-800 py-16 lg:py-20 relative overflow-hidden">

    {/* Subtle gold glow */}
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
    <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-40 bg-gold-500/6 rounded-full blur-3xl pointer-events-none" />

    <div className="relative max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

        {/* Left */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-500">
              Places Are Limited
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
            Ready to Join?
          </h2>
          <p className="text-navy-200 text-sm mt-2 max-w-md leading-relaxed">
            Seats are capped at 20–25 per camp to guarantee quality, close supervision, and a truly personal experience. Secure your place early.
          </p>
        </motion.div>

        {/* Right: CTAs */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="flex flex-wrap gap-3"
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/register/camp"
              className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold px-7 py-3 rounded-md lg:rounded-lg text-sm transition-colors duration-200 shadow-lg"
            >
              Register Your Interest <ChevronRight size={15} />
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <a
              href="https://wa.me/601168786103"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border border-navy-600 text-navy-200 hover:border-gold-500 hover:text-gold-400 font-semibold px-7 py-3 rounded-md lg:rounded-lg text-sm transition-all duration-200"
            >
              <MessageCircle size={15} /> WhatsApp Us
            </a>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <a
              href={brochureUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border border-navy-600 text-navy-200 hover:border-gold-500 hover:text-gold-400 font-semibold px-7 py-3 rounded-md lg:rounded-lg text-sm transition-all duration-200"
            >
              <Download size={15} /> Brochure
            </a>
          </motion.div>
        </motion.div>

      </div>
    </div>
  </section>
);

export default CampCTA;
