// @ts-nocheck
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MdEmail, MdPhone, MdLanguage, MdArrowForward } from "react-icons/md";
import { FaLinkedinIn, FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

const socials = [
  { icon: <FaLinkedinIn size={14} />, href: "#",                          label: "LinkedIn" },
  { icon: <FaFacebookF  size={14} />, href: "#",                          label: "Facebook" },
  { icon: <FaInstagram  size={14} />, href: "#",                          label: "Instagram" },
  { icon: <FaWhatsapp   size={14} />, href: "https://wa.me/601139936766", label: "WhatsApp" },
];

const quickLinks = [
  { label: "Home",        to: "/" },
  { label: "About IKA",   to: "/about" },
  { label: "Programs",    to: "/training" },
  { label: "Instructors", to: "/instructors" },
  { label: "Contact",     to: "/contact" },
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const Footer = () => {
  return (
    <footer className="bg-slate-900 relative overflow-hidden">

      {/* Giant "IKA" background text */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden
      >
        <span
          className="text-[28vw] font-extrabold text-slate-800 leading-none tracking-tighter"
          style={{ opacity: 0.35 }}
        >
          IKA
        </span>
      </div>

      {/* Gold top line */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-gold-500 to-transparent" />

      {/* Content */}
      <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-8">

        {/* Top row — logo + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-14"
        >
          <div>
            <img src="/brand/IKA-logo-bg.png" alt="IKA" className="h-12 w-auto mb-2 brightness-200" />
            <p className="text-slate-300 text-sm">
              International Knowledge Academy
            </p>
          </div>
          <a
            href="mailto:info@ika-edu.com"
            className="group flex items-center gap-2 border border-gold-500 text-gold-400 hover:bg-gold-500 hover:text-slate-900 font-semibold px-6 py-3 rounded-full text-sm transition-all duration-300"
          >
            Get in Touch
            <MdArrowForward size={15} className="group-hover:translate-x-1 transition-transform duration-200" />
          </a>
        </motion.div>

        {/* Main grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-slate-700"
        >
          {/* About */}
          <motion.div variants={item}>
            <h4 className="text-gold-500 font-bold text-xs uppercase tracking-widest mb-5">
              About Us
            </h4>
            <p className="text-slate-300 text-sm leading-relaxed mb-5">
              Delivering world-class training programs that blend deep knowledge with practical
              experience — empowering organizations across 10 countries.
            </p>
            <p className="text-slate-400 text-xs italic">
              "Invest in Your Employees and Invest in the Future of Your Institution."
            </p>
            {/* Socials */}
            <div className="flex gap-2 mt-6">
              {socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                  className="w-9 h-9 rounded-full border border-slate-700 text-slate-400 hover:border-gold-500 hover:text-gold-500 flex items-center justify-center transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick links */}
          <motion.div variants={item}>
            <h4 className="text-gold-500 font-bold text-xs uppercase tracking-widest mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((l) => (
                <li key={l.to + l.label}>
                  <Link to={l.to}
                    className="text-slate-300 text-sm hover:text-gold-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="h-px w-4 bg-gold-500 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:w-5" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={item}>
            <h4 className="text-gold-500 font-bold text-xs uppercase tracking-widest mb-5">
              Contact
            </h4>
            <ul className="space-y-4">
              {[
                { icon: <MdEmail size={16} />, label: "Email",   text: "info@ika-edu.com",     href: "mailto:info@ika-edu.com" },
                { icon: <MdPhone size={16} />, label: "Phone",   text: "+601139936766",         href: "https://wa.me/601139936766" },
                { icon: <MdLanguage size={16} />, label: "Web",  text: "www.ika-edu.com",       href: "https://www.ika-edu.com" },
              ].map((c) => (
                <li key={c.text}>
                  <a href={c.href} target="_blank" rel="noreferrer"
                    className="group flex items-start gap-3"
                  >
                    <span className="w-8 h-8 rounded-lg bg-slate-800 group-hover:bg-gold-500 text-gold-500 group-hover:text-slate-900 flex items-center justify-center flex-shrink-0 transition-all duration-200">
                      {c.icon}
                    </span>
                    <span>
                      <p className="text-slate-400 text-xs mb-0.5">{c.label}</p>
                      <p className="text-slate-200 text-sm group-hover:text-gold-400 transition-colors">{c.text}</p>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} International Knowledge Academy. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <span className="text-slate-500 text-xs hover:text-gold-400 transition-colors cursor-pointer">Privacy Policy</span>
            <span className="text-slate-700">·</span>
            <span className="text-slate-500 text-xs hover:text-gold-400 transition-colors cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
