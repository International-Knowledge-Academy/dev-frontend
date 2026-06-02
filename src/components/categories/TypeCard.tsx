// @ts-nocheck
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MdArrowForward } from "react-icons/md";

interface Props {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
  delay?: number;
}

const TypeCard = ({ icon: Icon, title, description, href, delay = 0 }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group relative bg-white border border-slate-100 hover:border-gold-300 hover:shadow-xl rounded-3xl overflow-hidden flex flex-col transition-all duration-300"
    >
      {/* Top accent line */}
      <div className="h-1 w-full bg-gradient-to-r from-navy-600 via-gold-500 to-navy-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="p-8 flex flex-col flex-1">
        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-navy-50 text-navy-600 flex items-center justify-center mb-6 group-hover:bg-gold-50 group-hover:text-gold-600 transition-colors duration-300">
          <Icon size={28} />
        </div>

        {/* Title */}
        <h3 className="text-navy-800 font-extrabold text-xl leading-snug mb-3 group-hover:text-navy-600 transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-slate-500 text-sm leading-relaxed flex-1 mb-6">
          {description}
        </p>

        {/* CTA */}
        <Link
          to={href}
          className="inline-flex items-center gap-2 text-sm font-semibold text-navy-600 group-hover:text-gold-600 transition-colors"
        >
          Explore Programs
          <MdArrowForward size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
        </Link>
      </div>
    </motion.div>
  );
};

export default TypeCard;
