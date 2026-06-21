// @ts-nocheck
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, Users, ChevronRight } from "lucide-react";

const camps = [
  {
    title:     "Gulf Youth Club",
    ageGroup:  "16 – 18",
    dates:     "12 – 23 July 2026",
    duration:  "12 Days",
    focus: [
      "Confidence Building",
      "Personal Development",
      "Leadership",
      "University Readiness",
      "Future Skills",
    ],
    description:
      "The club focuses on confidence building, personal development, leadership, university readiness, and future skills within an organised, engaging, and internationally oriented environment.",
    accent: "gold",
  },
  {
    title:     "Gulf Future Leaders Club",
    ageGroup:  "19 – 22",
    dates:     "26 July – 6 August 2026",
    duration:  "12 Days",
    focus: [
      "Advanced Leadership",
      "Career Planning",
      "Artificial Intelligence",
      "Entrepreneurship",
      "Innovative Thinking",
    ],
    description:
      "The club focuses on advanced leadership, career planning, artificial intelligence, entrepreneurship, innovative thinking, and the development of future-focused initiatives and projects.",
    accent: "navy",
  },
];

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", delay: d } }),
};

const CampTypesSection = () => (
  <section className="py-20 lg:py-28 bg-white">
    <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">

      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true }}
        variants={fadeUp}
        className="text-center mb-14"
      >
        <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-gold-600 mb-3">
          Malaysia 2026
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900">Available Clubs</h2>
        <p className="mt-3 text-slate-500 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
          Two tailored programmes designed for different age groups — each built around a distinct leadership journey.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {camps.map(({ title, ageGroup, dates, focus, description, accent }, i) => (
          <motion.div
            key={title}
            initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.1}
            variants={fadeUp}
            className="relative bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col"
          >
            {/* Top accent bar */}
            <div className={`h-1.5 w-full ${accent === "gold" ? "bg-gradient-to-r from-gold-400 to-gold-600" : "bg-gradient-to-r from-navy-600 to-navy-800"}`} />

            <div className="p-6 sm:p-8 flex flex-col flex-1">
              <h3 className="text-xl font-extrabold text-navy-900 mb-4">{title}</h3>

              {/* Meta pills */}
              <div className="flex flex-wrap gap-2.5 mb-5">
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5">
                  <Users size={13} className="text-navy-400" />
                  <span className="text-xs font-semibold text-navy-700">Age {ageGroup}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5">
                  <Calendar size={13} className="text-navy-400" />
                  <span className="text-xs font-semibold text-navy-700">{dates}</span>
                </div>
              </div>

              <p className="text-sm text-slate-500 leading-relaxed mb-6">{description}</p>

              {/* Focus tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {focus.map((f) => (
                  <span key={f}
                    className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                      accent === "gold"
                        ? "bg-gold-50 text-gold-700 border-gold-200"
                        : "bg-navy-50 text-navy-700 border-navy-100"
                    }`}
                  >
                    {f}
                  </span>
                ))}
              </div>

              <div className="mt-auto">
                <Link
                  to="/register/club"
                  className={`inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-md lg:rounded-lg transition-all duration-200 ${
                    accent === "gold"
                      ? "bg-gold-500 hover:bg-gold-400 text-navy-900"
                      : "bg-navy-800 hover:bg-navy-700 text-white"
                  }`}
                >
                  Register Your Interest <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default CampTypesSection;
