// @ts-nocheck
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Calendar, Download,
  Brain, Users, Mic2, Cpu, GraduationCap, Lightbulb,
} from "lucide-react";

/* ── variants ────────────────────────────────────────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 32 },
  visible: (d = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: d },
  }),
};

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const staggerItem = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const scaleIn = {
  hidden:  { opacity: 0, scale: 0.92 },
  visible: (d = 0) => ({
    opacity: 1, scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: d },
  }),
};

/* ── data ────────────────────────────────────────────────────────────────── */
const stats = [
  { value: "12",    label: "Days programme"  },
  { value: "20–25", label: "Seats per camp"  },
  { value: "4",     label: "Gulf countries"  },
];

const camps = [
  {
    title:       "Gulf Youth Club",
    age:         "Ages 16–18",
    dates:       "12–23 July 2026",
    description: "Confidence building, personal development, leadership, and university readiness in an organised international environment.",
    tags:        ["Leadership", "Confidence", "Future skills", "Teamwork"],
    highlight:   false,
  },
  {
    title:       "Gulf Future Leaders Club",
    age:         "Ages 19–22",
    dates:       "26 July–6 Aug 2026",
    description: "Advanced leadership, career planning, AI, entrepreneurship, and building future-focused initiatives and projects.",
    tags:        ["Entrepreneurship", "AI", "Career planning", "Innovation"],
    highlight:   true,
  },
];

const objectives = [
  { icon: Brain,         title: "Confidence and independence",     body: "Build stronger self-awareness, personal discipline, and the ability to operate independently in new environments."  },
  { icon: Users,         title: "Leadership and teamwork",         body: "Lead teams, assign roles, make decisions, solve problems, and respond effectively to real challenges."              },
  { icon: Mic2,          title: "Communication and presentation",  body: "Public speaking, persuasion, body language, and delivering professional presentations with clarity."                },
  { icon: Cpu,           title: "Future skills and AI",            body: "Critical thinking, digital awareness, productivity tools, and practical uses of artificial intelligence."           },
  { icon: Lightbulb,     title: "Entrepreneurship and innovation", body: "Identify opportunities, develop ideas, and turn concepts into presentable projects and initiatives."                },
  { icon: GraduationCap, title: "Academic and career planning",    body: "Explore university pathways, international opportunities, and build a clearer vision for the future."              },
];

/* ── component ───────────────────────────────────────────────────────────── */
const CampSection = ({ brochureUrl = "#" }: { brochureUrl?: string }) => {
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-60px" });

  return (
    <section className="bg-slate-50 py-20 lg:py-28 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 space-y-16">

        {/* ── Overview card ──────────────────────────────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={scaleIn}
          className="bg-navy-800 border border-navy-700 rounded-2xl p-8 sm:p-10 relative overflow-hidden"
        >
          {/* subtle gold glow top-right */}
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

          <motion.p
            variants={fadeUp} custom={0.05}
            initial="hidden" animate="visible"
            className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-500 mb-4"
          >
            International Knowledge Academy · Malaysia 2026
          </motion.p>

          <motion.h2
            variants={fadeUp} custom={0.1}
            initial="hidden" animate="visible"
            className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-4"
          >
            Gulf Young Leaders Club<br className="hidden sm:block" /> Malaysia 2026
          </motion.h2>

          <motion.p
            variants={fadeUp} custom={0.15}
            initial="hidden" animate="visible"
            className="text-navy-200 text-sm sm:text-base leading-relaxed max-w-2xl mb-8"
          >
            A carefully designed international experience for Gulf youth — combining leadership training,
            future skills, educational visits, and adventure in Malaysia.
          </motion.p>

          {/* Stats — staggered */}
          <motion.div
            ref={statsRef}
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
            variants={stagger}
            className="grid grid-cols-3 gap-3 mb-8 max-w-lg"
          >
            {stats.map(({ value, label }) => (
              <motion.div
                key={label}
                variants={staggerItem}
                whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
                className="bg-navy-700 border border-navy-600 rounded-xl px-4 py-4 cursor-default"
              >
                <p className="text-gold-400 text-2xl font-extrabold leading-none mb-1">{value}</p>
                <p className="text-navy-200 text-xs leading-tight">{label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            variants={fadeUp} custom={0.3}
            initial="hidden" animate="visible"
            className="flex flex-wrap gap-3"
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/register/club"
                className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold px-6 py-2.5 rounded-md lg:rounded-lg text-sm transition-colors duration-200"
              >
                Register your interest
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <a
                href={brochureUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border border-navy-500 text-navy-200 hover:border-gold-500 hover:text-gold-400 font-semibold px-6 py-2.5 rounded-md lg:rounded-lg text-sm transition-all duration-200"
              >
                <Download size={14} /> Download brochure
              </a>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* ── Available camps ────────────────────────────────────────── */}
        <div>
          <motion.p
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp}
            className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-600 mb-6"
          >
            Available Clubs
          </motion.p>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {camps.map(({ title, age, dates, description, tags, highlight }) => (
              <motion.div
                key={title}
                variants={staggerItem}
                whileHover={{
                  y: -4,
                  boxShadow: highlight
                    ? "0 8px 32px rgba(201,168,76,0.18)"
                    : "0 8px 32px rgba(16,26,60,0.35)",
                  transition: { duration: 0.25, ease: "easeOut" },
                }}
                className={`rounded-2xl p-6 flex flex-col gap-5 cursor-default ${
                  highlight
                    ? "bg-navy-700 border border-gold-500"
                    : "bg-navy-800 border border-navy-700"
                }`}
              >
                <span className={`self-start text-xs font-semibold px-3 py-1 rounded-full border ${
                  highlight
                    ? "bg-gold-900 text-gold-300 border-gold-700"
                    : "bg-navy-700 text-navy-200 border-navy-600"
                }`}>
                  {age}
                </span>

                <div>
                  <h3 className="text-white font-extrabold text-lg leading-snug mb-2">{title}</h3>
                  <div className="flex items-center gap-2 text-navy-300 text-xs mb-3">
                    <Calendar size={12} />
                    {dates}
                  </div>
                  <p className="text-navy-100 text-sm leading-relaxed">{description}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <span key={t} className="text-xs text-navy-200 border border-navy-600 px-2.5 py-1 rounded-full">
                      {t}
                    </span>
                  ))}
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/register/club"
                    className="block w-full text-center border border-navy-500 text-white hover:bg-gold-500 hover:text-navy-900 hover:border-gold-500 font-semibold py-2.5 rounded-md lg:rounded-lg text-sm transition-all duration-200"
                  >
                    Register for this club
                  </Link>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ── Objectives ─────────────────────────────────────────────── */}
        <div>
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp}
            className="mb-8"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-600 mb-3">
              What Participants Gain
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">Camp objectives</h2>
            <p className="text-navy-200 text-sm sm:text-base max-w-xl">
              Every element of the programme is designed to build real skills, lasting confidence, and a clearer direction for the future.
            </p>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {objectives.map(({ icon: Icon, title, body }) => (
              <motion.div
                key={title}
                variants={staggerItem}
                whileHover={{
                  y: -3,
                  borderColor: "rgba(201,168,76,0.4)",
                  transition: { duration: 0.2 },
                }}
                className="bg-navy-800 border border-navy-700 rounded-2xl p-5 flex flex-col gap-3 cursor-default"
              >
                <motion.div
                  whileHover={{ scale: 1.12, rotate: 4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="w-9 h-9 rounded-lg bg-gold-900 border border-gold-700 flex items-center justify-center flex-shrink-0 origin-center"
                >
                  <Icon size={17} className="text-gold-400" />
                </motion.div>
                <div>
                  <h3 className="text-white font-bold text-sm mb-1.5">{title}</h3>
                  <p className="text-navy-200 text-xs leading-relaxed">{body}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default CampSection;
