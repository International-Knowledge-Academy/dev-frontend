// @ts-nocheck
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const accommodation = [
  "Comfortable hotel accommodation.",
  "Daily meals.",
  "Organised internal transportation.",
  "Airport reception and departure assistance.",
  "General supervision and team supervisors.",
  "Attendance and movement monitoring.",
  "Clear accommodation and activity guidelines.",
  "Organised communication with parents.",
  "Safety and emergency procedures.",
];

const requirements = [
  "Applicants must fall within the specified age group.",
  "Parental approval is required.",
  "Participants must be medically fit to join the programme.",
  "Participants must comply with camp rules and instructions.",
  "Applicants should demonstrate a genuine willingness to learn and work within a team.",
  "A short admission interview must be completed.",
  "All required forms must be submitted.",
];

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", delay: d } }),
};

const CampWhyMalaysiaSection = () => (
  <section className="py-20 lg:py-28 bg-slate-50">
    <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 space-y-20">

      {/* Why Malaysia */}
      <div>
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={fadeUp}
          className="max-w-3xl"
        >
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-gold-600 mb-3">
            The Destination
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 mb-5">Why Malaysia?</h2>
          <p className="text-slate-600 text-base leading-relaxed mb-4">
            Malaysia offers a distinctive environment combining cultural diversity, international education,
            natural beauty, modern cities, and world-class attractions — making it an ideal destination for
            an experience that combines learning and discovery.
          </p>
          <p className="text-slate-500 text-sm leading-relaxed">
            The camp allows participants to experience university life, explore a new culture, and take part
            in a wide range of activities within a well-organised environment.
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {["Cultural Diversity", "International Education", "Modern Cities", "World-Class Attractions"].map((label, i) => (
            <motion.div
              key={label}
              initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.08}
              variants={fadeUp}
              className="bg-navy-700 rounded-2xl px-5 py-6 text-center"
            >
              <p className="text-gold-300 font-bold text-sm leading-snug">{label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Accommodation + Requirements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={fadeUp}
        >
          <h3 className="text-xl font-extrabold text-navy-900 mb-5">Accommodation & Supervision</h3>
          <p className="text-sm text-slate-500 mb-5 leading-relaxed">
            An organised environment designed to ensure participants feel comfortable, supported, and safe throughout the programme.
          </p>
          <ul className="space-y-2.5">
            {accommodation.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-600">{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={fadeUp} custom={0.1}
        >
          <h3 className="text-xl font-extrabold text-navy-900 mb-5">Participation Requirements</h3>
          <p className="text-sm text-slate-500 mb-5 leading-relaxed">
            To ensure the best experience for every participant, all of the following must be met:
          </p>
          <ul className="space-y-2.5">
            {requirements.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 size={15} className="text-navy-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-600">{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  </section>
);

export default CampWhyMalaysiaSection;
