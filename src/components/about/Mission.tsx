// @ts-nocheck
import { motion } from "framer-motion";
import { MdVisibility, MdFlag, MdTrackChanges } from "react-icons/md";

const goals = [
  "Deliver world-class training programs tailored to organizational needs",
  "Bridge the gap between theoretical knowledge and real-world application",
  "Empower professionals with internationally recognized certifications",
  "Foster continuous learning cultures within institutions",
  "Expand access to quality training across global markets",
  "Build long-term partnerships with leading organizations and institutions",
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const goalItem = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const Mission = () => {
  return (
    <section id="mission" className="py-24 px-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="text-gold-500 font-semibold text-sm uppercase tracking-widest">
            Our Purpose
          </span>
          <h2 className="text-4xl font-extrabold text-navy-800 mt-3">
            Vision, Mission & Goals
          </h2>
        </motion.div>

        {/* Vision & Mission cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="bg-navy-600 rounded-3xl p-8 text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-gold-500 opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            <div className="w-12 h-12 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center mb-5">
              <MdVisibility size={26} />
            </div>
            <h3 className="text-xl font-bold text-gold-400 mb-3">Our Vision</h3>
            <p className="text-navy-200 leading-relaxed text-sm">
              To be the leading international academy recognized for transforming individuals
              and organizations through innovative, high-impact training and development programs —
              building a future where knowledge drives excellence globally.
            </p>
          </motion.div>

          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.12 }}
            className="bg-gold-500 rounded-3xl p-8 relative overflow-hidden"
          >
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-navy-900 opacity-10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />
            <div className="w-12 h-12 rounded-xl bg-white/20 text-white flex items-center justify-center mb-5">
              <MdFlag size={26} />
            </div>
            <h3 className="text-xl font-bold text-navy-900 mb-3">Our Mission</h3>
            <p className="text-navy-800 leading-relaxed text-sm">
              To provide high-quality, practical training programs that blend deep theoretical
              knowledge with real-world experience — empowering individuals and institutions to
              achieve lasting excellence.
              <span className="italic font-semibold block mt-3">
                "Invest in Your Employees and Invest in the Future of Your Institution."
              </span>
            </p>
          </motion.div>
        </div>

        {/* Goals */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white border border-slate-100 rounded-3xl p-10"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-navy-50 text-navy-600 flex items-center justify-center">
              <MdTrackChanges size={22} />
            </div>
            <h3 className="text-xl font-bold text-navy-800">Goals & Objectives</h3>
          </div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={container}
          >
            {goals.map((goal, idx) => (
              <motion.div key={idx} variants={goalItem} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-gold-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-slate-600 text-sm leading-relaxed">{goal}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default Mission;
