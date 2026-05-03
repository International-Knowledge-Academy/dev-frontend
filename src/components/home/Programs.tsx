// @ts-nocheck
import { motion } from "framer-motion";
import { MdSchool, MdWorkspacePremium, MdHandshake } from "react-icons/md";

const programs = [
  {
    icon: <MdSchool size={32} />,
    title: "Training Courses",
    duration: "5 Consecutive Days",
    description:
      "Intensive short courses held at a professional training venue. Focused, structured, and designed to deliver immediate practical value.",
    badge: "Most Popular",
  },
  {
    icon: <MdWorkspacePremium size={32} />,
    title: "Training Diplomas",
    duration: "10 Consecutive Days",
    description:
      "In-depth diploma programs for professionals seeking comprehensive mastery. Covers both foundational and advanced aspects of the subject.",
    badge: "In-Depth",
  },
  {
    icon: <MdHandshake size={32} />,
    title: "Contracted Courses",
    duration: "Fully Customized",
    description:
      "Bespoke programs developed in partnership with your organization. Tailored content, schedule, and delivery method to match your exact requirements.",
    badge: "Tailored",
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const Programs = () => {
  return (
    <section className="py-24 px-6 bg-white">
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
            Our Programs
          </span>
          <h2 className="text-4xl font-extrabold text-navy-800 mt-3">
            Three Ways to Learn
          </h2>
          <p className="text-slate-500 mt-4 max-w-xl mx-auto">
            Choose the format that best fits your team's goals, timeline, and learning style.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={container}
        >
          {programs.map((p, i) => (
            <motion.div
              key={p.title}
              variants={cardVariant}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className={`relative rounded-3xl p-8 flex flex-col gap-5 border transition-all duration-300 cursor-default ${
                i === 0
                  ? "bg-navy-600 border-navy-700 text-white shadow-xl shadow-navy-900/20"
                  : "bg-white border-slate-100 hover:border-gold-300 hover:shadow-lg"
              }`}
            >
              {/* Badge */}
              <span
                className={`absolute top-6 right-6 text-xs font-semibold px-3 py-1 rounded-full ${
                  i === 0
                    ? "bg-gold-500 text-navy-900"
                    : "bg-navy-50 text-navy-600"
                }`}
              >
                {p.badge}
              </span>

              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  i === 0 ? "bg-navy-700 text-gold-400" : "bg-navy-50 text-navy-600"
                }`}
              >
                {p.icon}
              </div>

              {/* Content */}
              <div>
                <h3 className={`text-xl font-bold ${i === 0 ? "text-white" : "text-navy-800"}`}>
                  {p.title}
                </h3>
                <p className={`text-sm font-medium mt-1 ${i === 0 ? "text-gold-400" : "text-gold-500"}`}>
                  {p.duration}
                </p>
                <p className={`text-sm mt-3 leading-relaxed ${i === 0 ? "text-navy-200" : "text-slate-500"}`}>
                  {p.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default Programs;
