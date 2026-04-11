// @ts-nocheck
import { motion } from "framer-motion";
import {
  MdDesignServices,
  MdAutorenew,
  MdPeople,
  MdTune,
  MdVerified,
  MdAttachMoney,
} from "react-icons/md";

const features = [
  {
    icon: <MdDesignServices size={28} />,
    title: "Custom Training Programs",
    description:
      "We design tailored training programs built around your organization's specific goals, culture, and workforce needs.",
  },
  {
    icon: <MdAutorenew size={28} />,
    title: "Updated & Modern Content",
    description:
      "Our training materials reflect the latest industry practices, tools, and real-world case studies — always current, always relevant.",
  },
  {
    icon: <MdPeople size={28} />,
    title: "Expert Trainers & Specialists",
    description:
      "A carefully selected group of seasoned professionals and subject-matter experts who bring deep knowledge and field experience.",
  },
  {
    icon: <MdTune size={28} />,
    title: "Flexible Delivery Options",
    description:
      "Choose what works best for your team — on-site, remote, or intensive programs — tailored to fit your schedule and location.",
  },
  {
    icon: <MdVerified size={28} />,
    title: "Accredited Certificates",
    description:
      "Participants receive internationally recognized certificates upon successful completion, adding real value to their professional profile.",
  },
  {
    icon: <MdAttachMoney size={28} />,
    title: "Competitive & Flexible Pricing",
    description:
      "We offer cost-effective training packages with flexible financing options to make quality development accessible for every organization.",
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
          <p className="text-gray-500 mt-4 max-w-xl mx-auto">
            Invest in your employees and invest in the future of your institution — with training built for real impact.
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
              className="group p-7 rounded-2xl border border-gray-100 hover:border-gold-300 hover:shadow-lg transition-colors duration-300 bg-white cursor-default"
            >
              <div className="w-12 h-12 rounded-xl bg-navy-50 text-navy-600 flex items-center justify-center mb-5 group-hover:bg-gold-500 group-hover:text-white transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-navy-800 mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
