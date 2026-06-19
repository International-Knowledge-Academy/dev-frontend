// @ts-nocheck
import { motion } from "framer-motion";
import { CheckCircle2, Target } from "lucide-react";

const outcomes = [
  "Understand their strengths and personal capabilities.",
  "Express their ideas with confidence and clarity.",
  "Lead tasks and initiatives.",
  "Think in a more innovative and solution-focused way.",
  "Use artificial intelligence tools responsibly and effectively.",
  "Plan their academic or professional pathway.",
  "Build new relationships with participants from different Gulf backgrounds.",
];

const audience = [
  "Ambitious and committed to personal development.",
  "Want to build confidence and strengthen their character.",
  "Interested in leadership and entrepreneurship.",
  "Wish to explore study opportunities in Malaysia.",
  "Want to develop future-ready skills.",
  "Prefer learning through experience and participation.",
  "Ready to take part in a new international experience.",
];

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", delay: d } }),
};

const CampAudienceSection = () => (
  <section className="py-20 lg:py-28 bg-white">
    <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

        {/* Expected Outcomes */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={fadeUp}
        >
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-gold-600 mb-3">
            After the Camp
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mb-6">Expected Outcomes</h2>
          <ul className="space-y-3">
            {outcomes.map((o, i) => (
              <motion.li
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.04}
                variants={fadeUp}
                className="flex items-start gap-3"
              >
                <CheckCircle2 size={16} className="text-gold-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-600 leading-relaxed">{o}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Who Is It For */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={fadeUp} custom={0.1}
        >
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-gold-600 mb-3">
            Right For You?
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mb-4">Who Is the Camp Designed For?</h2>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            The camp is designed for young people who:
          </p>
          <div className="bg-navy-800 rounded-2xl p-6 space-y-3">
            {audience.map((a, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.04}
                variants={fadeUp}
                className="flex items-start gap-3"
              >
                <Target size={14} className="text-gold-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-300 leading-relaxed">{a}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default CampAudienceSection;
