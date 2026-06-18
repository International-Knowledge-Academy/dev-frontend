// @ts-nocheck
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const objectives = [
  "Build greater confidence, independence, and self-awareness.",
  "Develop leadership skills and a stronger sense of responsibility.",
  "Improve communication, presentation, and influencing skills.",
  "Strengthen teamwork and problem-solving abilities.",
  "Expand participants' awareness of future skills.",
  "Introduce practical uses of artificial intelligence in learning and productivity.",
  "Encourage entrepreneurial thinking and turn ideas into initiatives.",
  "Help participants explore their academic and career pathways.",
  "Strengthen cultural awareness and confidence in international environments.",
  "Deliver a balanced experience combining learning, enjoyment, and achievement.",
];

const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut", delay: d } }),
};

const CampObjectivesSection = () => (
  <section className="py-20 lg:py-28 bg-navy-50 relative overflow-hidden">
    <div className="absolute -top-20 right-1/3 w-[400px] h-[400px] bg-gold-100/50 rounded-full blur-3xl pointer-events-none" />

    <div className="relative max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">
      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true }}
        variants={fadeUp}
        className="text-center mb-14"
      >
        <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-gold-600 mb-3">
          What We Aim For
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900">Camp Objectives</h2>
        <p className="mt-3 text-slate-500 max-w-xl mx-auto text-sm sm:text-base">
          Every element of the programme is designed with clear developmental goals in mind.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {objectives.map((obj, i) => (
          <motion.div
            key={i}
            initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.04}
            variants={fadeUp}
            className="flex items-start gap-3.5 bg-white border border-slate-100 shadow-sm rounded-xl px-5 py-4"
          >
            <CheckCircle2 size={18} className="text-gold-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 leading-relaxed">{obj}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default CampObjectivesSection;
