// @ts-nocheck
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, ClipboardList, BadgeCheck, ArrowRight } from "lucide-react";

const steps = [
  {
    icon:        <Search size={24} />,
    number:      "01",
    title:       "Browse & Choose",
    description:
      "Explore our catalog of training programs by category, field, or location. Find the program that matches your team's goals and schedule.",
  },
  {
    icon:        <ClipboardList size={24} />,
    number:      "02",
    title:       "Submit Your Registration",
    description:
      "Fill out the online registration form with participant details. It takes less than 2 minutes — no account required.",
  },
  {
    icon:        <BadgeCheck size={24} />,
    number:      "03",
    title:       "Get Confirmed & Certified",
    description:
      "Our team reviews your submission and sends a confirmation. Upon completion, every participant receives an accredited IKA certificate.",
  },
];

/* ─── Animation variants ───────────────────────────────────────────────────── */

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, ease: "easeOut", delay },
  }),
};

const container = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariant = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

/* ─── Section ──────────────────────────────────────────────────────────────── */

const HowToEnroll = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-24 px-6 bg-navy-900 overflow-hidden">

      {/* Decorative blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-navy-600/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16 space-y-5">

          <motion.div
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            className="flex justify-center"
          >
            <span className="inline-flex items-center gap-2 bg-gold-500/10 border border-gold-500/30 text-gold-400 text-[11px] font-bold uppercase tracking-[0.15em] px-4 py-2 rounded-full">
              Simple Process
            </span>
          </motion.div>

          <motion.h2
            custom={0.08}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            className="text-3xl md:text-5xl font-extrabold text-white leading-tight tracking-tight"
          >
            Enroll in{" "}
            <span className="bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 bg-clip-text text-transparent">
              3 Simple Steps
            </span>
          </motion.h2>

          <motion.p
            custom={0.16}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            className="text-navy-300 max-w-lg mx-auto text-sm md:text-base leading-relaxed"
          >
            Registering for an IKA training program is fast and straightforward.
            Here's how to get started.
          </motion.p>

          <motion.div
            custom={0.22}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            className="flex justify-center"
          >
            <div className="w-16 h-[3px] rounded-full bg-gradient-to-r from-gold-400 to-gold-600" />
          </motion.div>
        </div>

        {/* Steps */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={container}
        >
          {steps.map((step, i) => (
            <motion.div key={step.number} variants={cardVariant} className="relative flex flex-col gap-5">

              {/* Connector line to next step (desktop only) */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-7 left-[calc(100%+20px)] right-[-20px] h-px bg-gradient-to-r from-gold-500/40 to-transparent pointer-events-none" />
              )}

              {/* Icon + large number */}
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-2xl bg-navy-800 border border-navy-700 flex items-center justify-center text-gold-400 flex-shrink-0">
                  {step.icon}
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gold-500 text-navy-900 text-[10px] font-extrabold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <span className="text-5xl font-black text-navy-700 leading-none select-none">
                  {step.number}
                </span>
              </div>

              {/* Text */}
              <div>
                <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-navy-300 text-sm leading-relaxed">{step.description}</p>
              </div>

            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <button
            onClick={() => navigate("/programs")}
            className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold text-sm px-10 py-3.5 rounded-md lg:rounded-lg transition-colors duration-200 shadow-lg shadow-gold-500/25"
          >
            Browse Programs & Register
            <ArrowRight size={16} />
          </button>
          <p className="text-navy-400 text-xs mt-3">No account required to register</p>
        </motion.div>

      </div>
    </section>
  );
};

export default HowToEnroll;
