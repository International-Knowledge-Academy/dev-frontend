// @ts-nocheck
import { motion } from "framer-motion";
import { MdEmail, MdLanguage, MdLocationOn } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";

const cards = [
  {
    icon: <MdEmail size={26} />,
    label: "Email Us",
    value: "info@ika-edu.com",
    sub: "We respond within 24 hours",
    href: "mailto:info@ika-edu.com",
    color: "group-hover:bg-navy-600",
  },
  {
    icon: <FaWhatsapp size={24} />,
    label: "WhatsApp",
    value: "+601139936766",
    sub: "Chat with us directly",
    href: "https://wa.me/601139936766",
    color: "group-hover:bg-green-600",
  },
  {
    icon: <MdLanguage size={26} />,
    label: "Website",
    value: "www.ika-edu.com",
    sub: "Visit our official site",
    href: "https://www.ika-edu.com",
    color: "group-hover:bg-gold-500",
  },
  {
    icon: <MdLocationOn size={26} />,
    label: "Locations",
    value: "10+ Countries",
    sub: "UAE · UK · Europe · Asia",
    href: null,
    color: "group-hover:bg-navy-600",
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const card = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const ContactCards = () => {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={container}
    >
      {cards.map((c) => {
        const Inner = (
          <motion.div
            variants={card}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="group relative bg-white border border-slate-100 hover:border-gold-300 hover:shadow-lg transition-all duration-300 rounded-2xl p-6 flex flex-col items-center text-center cursor-pointer overflow-hidden"
          >
            {/* Icon */}
            <div className={`w-14 h-14 rounded-2xl bg-navy-50 text-navy-600 flex items-center justify-center mb-4 transition-all duration-300 ${c.color} group-hover:text-white`}>
              {c.icon}
            </div>

            <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-1">
              {c.label}
            </p>
            <p className="text-navy-800 font-bold text-base mb-1">{c.value}</p>
            <p className="text-slate-400 text-xs">{c.sub}</p>

            {/* Bottom hover line */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </motion.div>
        );

        return c.href ? (
          <a key={c.label} href={c.href} target="_blank" rel="noreferrer">
            {Inner}
          </a>
        ) : (
          <div key={c.label}>{Inner}</div>
        );
      })}
    </motion.div>
  );
};

export default ContactCards;
