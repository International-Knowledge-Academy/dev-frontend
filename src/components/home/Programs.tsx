// @ts-nocheck
import { motion } from "framer-motion";
import { MdTravelExplore, MdGroups, MdWorkspacePremium } from "react-icons/md";

const programs = [
  {
    icon: <MdTravelExplore size={32} />,
    title: "International Training Programs",
    badge: "Core Program",
    description:
      "Delivered in selected international destinations, allowing participants to gain professional knowledge while experiencing new cultures, advanced environments, and global perspectives. Designed for employees, supervisors, managers, and senior leaders.",
  },
  {
    icon: <MdWorkspacePremium size={32} />,
    title: "Executive Workshops & Professional Development",
    badge: "High Impact",
    description:
      "Intensive workshops focused on leadership, management, governance, institutional excellence, quality, human resources, project management, and innovation combining theory, case studies, group discussions, and practical exercises.",
  },
  {
    icon: <MdGroups size={32} />,
    title: "Training Study Trips",
    badge: "Immersive",
    description:
      "Specialized training study trips that combine professional learning with institutional visits, cultural exposure, and international networking ideal for organizations seeking to develop staff through a rich benchmarking experience.",
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
    <section className="relative py-24 px-6 bg-slate-50 overflow-hidden">
      <div className="absolute -top-24 left-1/3  w-[480px] h-[480px] bg-gold-100/40  rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0  right-1/4 w-[360px] h-[360px] bg-navy-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="relative max-w-6xl mx-auto">

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
          <p className="text-slate-500 mt-4 max-w-xl mx-auto ">
            IKA offers a flexible and impactful learning experience designed for professionals
            and organizations seeking international training opportunities outside their home countries.
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
                <h3 className={`text-xl font-bold line-clamp-2 ${i === 0 ? "text-white" : "text-navy-800"}`}>
                  {p.title}
                </h3>
                <p className={`text-sm mt-3 leading-relaxed text-justify ${i === 0 ? "text-navy-200" : "text-slate-500"}`}>
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
