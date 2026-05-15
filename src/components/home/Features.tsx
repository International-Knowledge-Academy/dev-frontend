// @ts-nocheck
import { motion } from "framer-motion";
import {
  MdTravelExplore,
  MdWorkspacePremium,
  MdPeople,
  MdAccountBalance,
  MdPublic,
  MdVerified,
} from "react-icons/md";

const features = [
  {
    icon: <MdTravelExplore size={28} />,
    title: "International Training Experience",
    description:
      "IKA specializes in delivering training programs outside participants' home countries, giving trainees the opportunity to learn in inspiring international environments that expand their professional perspectives.",
  },
  {
    icon: <MdWorkspacePremium size={28} />,
    title: "Practical and Applied Learning",
    description:
      "Our programs focus on real workplace challenges, applied tools, case studies, and practical outcomes rather than purely theoretical content.",
  },
  {
    icon: <MdPeople size={28} />,
    title: "Expert Trainers and Specialists",
    description:
      "IKA works with experienced trainers, academics, consultants, and professional experts from diverse fields to ensure depth, relevance, and credibility.",
  },
  {
    icon: <MdAccountBalance size={28} />,
    title: "Tailored for Institutional Needs",
    description:
      "We design programs that match the objectives of government entities, private organizations, universities, and professional institutions seeking external training for their employees and leaders.",
  },
  {
    icon: <MdPublic size={28} />,
    title: "Multicultural Learning Environment",
    description:
      "Our programs bring together participants from different backgrounds, creating valuable opportunities for dialogue, networking, and exchange of professional experiences.",
  },
  {
    icon: <MdVerified size={28} />,
    title: "Professional Certificates",
    description:
      "Participants receive documented certificates from IKA upon successful program completion, supporting their professional development and institutional training records.",
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

const Features = () => {
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
            Why Choose IKA
          </span>
          <h2 className="text-4xl font-extrabold text-navy-800 mt-3">
            What Sets Us Apart
          </h2>
          <p className="text-slate-500 mt-4 max-w-xl mx-auto text-justify">
            We do not offer ordinary training programs. We create international learning experiences
            that are practical, engaging, and professionally valuable.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={container}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={card}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group p-7 rounded-2xl border border-slate-100 hover:border-gold-300 hover:shadow-lg transition-colors duration-300 bg-white cursor-default"
            >
              <div className="w-12 h-12 rounded-xl bg-navy-50 text-navy-600 flex items-center justify-center mb-5 group-hover:bg-gold-500 group-hover:text-white transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-navy-800 mb-2">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed text-justify">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
