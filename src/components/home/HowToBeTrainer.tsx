// @ts-nocheck
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Send, UserCheck, GraduationCap, ArrowRight } from "lucide-react";

const steps = [
  {
    icon:        <Send size={22} />,
    number:      "01",
    title:       "Submit Your Application",
    description:
      "Share your professional background, areas of expertise, and the fields you wish to deliver. IKA works with experienced trainers, academics, consultants, and professional experts from diverse fields.",
  },
  {
    icon:        <UserCheck size={22} />,
    number:      "02",
    title:       "Assessment & Interview",
    description:
      "Our team evaluates your depth, relevance, and credibility in your field. We match each trainer to programs where they can deliver knowledge with the greatest real-world impact.",
  },
  {
    icon:        <GraduationCap size={22} />,
    number:      "03",
    title:       "Deliver & Make an Impact",
    description:
      "Join IKA's international trainer network and deliver programs that combine academic depth, practical tools, and measurable outcomes — helping professionals achieve excellence worldwide.",
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

const HowToBeTrainer = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-24 px-6 bg-slate-50 overflow-hidden">

      {/* Decorative blobs */}
      <div className="absolute -top-24 right-1/4 w-[480px] h-[480px] bg-gold-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0  left-1/4 w-[360px] h-[360px] bg-navy-100/30 rounded-full blur-3xl pointer-events-none" />

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
            <span className="inline-flex items-center gap-2 bg-gold-50 border border-gold-200 text-gold-600 text-[11px] font-bold uppercase tracking-[0.15em] px-4 py-2 rounded-full">
              Join Our Team
            </span>
          </motion.div>

          <motion.h2
            custom={0.08}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            className="text-3xl md:text-5xl font-extrabold text-navy-800 leading-tight tracking-tight"
          >
            Become an{" "}
            <span className="bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 bg-clip-text text-transparent">
              IKA Trainer
            </span>
          </motion.h2>

          <motion.p
            custom={0.16}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            className="text-slate-500 max-w-lg mx-auto text-sm md:text-base leading-relaxed "
          >
            IKA works with experienced trainers, academics, and consultants to deliver
            programs with depth, relevance, and credibility. Here's how to join our network.
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
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={container}
        >
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              variants={cardVariant}
              className="relative bg-white border border-slate-100 rounded-2xl p-8 flex flex-col gap-5 hover:border-gold-200 hover:shadow-[0_8px_32px_rgba(201,168,76,0.10)] transition-all duration-300"
            >
              {/* Connector line to next step (desktop only) */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[calc(100%+1px)] w-8 h-px bg-gradient-to-r from-gold-300 to-transparent pointer-events-none" />
              )}

              {/* Step number badge + icon */}
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-xl bg-navy-50 border border-navy-100 flex items-center justify-center text-navy-600 flex-shrink-0">
                  {step.icon}
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gold-500 text-white text-[10px] font-extrabold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <span className="text-5xl font-black text-slate-100 leading-none select-none">
                  {step.number}
                </span>
              </div>

              {/* Text */}
              <div>
                <h3 className="text-navy-800 font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed text-justify">{step.description}</p>
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
            onClick={() => navigate("/register/trainer")}
            className="inline-flex items-center gap-2 bg-navy-800 hover:bg-navy-700 text-white font-bold text-sm px-10 py-3.5 rounded-md lg:rounded-lg transition-colors duration-200 shadow-sm"
          >
            Apply to Be a Trainer
            <ArrowRight size={16} />
          </button>
          <p className="text-slate-400 text-xs mt-3">We review every application within 3 business days</p>
        </motion.div>

      </div>
    </section>
  );
};

export default HowToBeTrainer;
