// @ts-nocheck
import { motion } from "framer-motion";
import {
  MdBusiness,
  MdAccountBalance,
  MdSchool,
  MdPerson,
  MdLocalHospital,
  MdEngineering,
} from "react-icons/md";

const audiences = [
  {
    icon: <MdBusiness size={28} />,
    title: "Corporate Organizations",
    description:
      "Private sector companies seeking to upskill their workforce, improve performance, and drive organizational excellence through structured training.",
  },
  {
    icon: <MdAccountBalance size={28} />,
    title: "Government Entities",
    description:
      "Public sector departments and ministries looking for tailored development programs that align with national vision and capacity-building goals.",
  },
  {
    icon: <MdSchool size={28} />,
    title: "Educational Institutions",
    description:
      "Universities, schools, and learning centers aiming to enhance faculty capabilities and deliver better educational outcomes.",
  },
  {
    icon: <MdPerson size={28} />,
    title: "Professionals & Individuals",
    description:
      "Ambitious professionals looking to gain internationally recognized certifications and advance their careers across any industry.",
  },
  {
    icon: <MdLocalHospital size={28} />,
    title: "Healthcare & NGOs",
    description:
      "Healthcare providers and non-profit organizations that require specialized training in management, compliance, and operational effectiveness.",
  },
  {
    icon: <MdEngineering size={28} />,
    title: "Technical & Industrial Sectors",
    description:
      "Engineering firms, manufacturing, and technical industries requiring specialized skills development and safety-focused training programs.",
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const card = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const TargetAudience = () => {
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
            Who We Serve
          </span>
          <h2 className="text-4xl font-extrabold text-navy-800 mt-3">
            Our Target Audience
          </h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto">
            IKA's programs are designed to serve a wide range of organizations and individuals
            across both public and private sectors.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={container}
        >
          {audiences.map((item) => (
            <motion.div
              key={item.title}
              variants={card}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group p-7 rounded-2xl border border-slate-100 hover:border-gold-300 hover:shadow-lg transition-colors duration-300 bg-white cursor-default"
            >
              <div className="w-12 h-12 rounded-xl bg-navy-50 text-navy-600 flex items-center justify-center mb-5 group-hover:bg-gold-500 group-hover:text-white transition-all duration-300">
                {item.icon}
              </div>
              <h3 className="text-base font-bold text-navy-800 mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default TargetAudience;
