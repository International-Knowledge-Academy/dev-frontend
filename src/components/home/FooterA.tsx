// @ts-nocheck
// OPTION A — Dark navy full-footer with CTA strip + social icons
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  MdEmail, MdPhone, MdLanguage,
  MdLocationOn, MdArrowForward,
} from "react-icons/md";
import {
  FaLinkedinIn, FaFacebookF, FaInstagram, FaWhatsapp,
} from "react-icons/fa";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: "easeOut", delay: i * 0.1 },
  }),
};

const quickLinks = [
  { label: "Home",      to: "/" },
  { label: "About",     to: "/about" },
  { label: "Programs",  to: "/training" },
  { label: "Instructors", to: "/instructors" },
  { label: "Contact",   to: "/contact" },
];

const programs = [
  { label: "Training Courses",    to: "/training" },
  { label: "Training Diplomas",   to: "/training" },
  { label: "Contracted Programs", to: "/training" },
];

const socials = [
  { icon: <FaLinkedinIn size={15} />, href: "#", label: "LinkedIn" },
  { icon: <FaFacebookF  size={15} />, href: "#", label: "Facebook" },
  { icon: <FaInstagram  size={15} />, href: "#", label: "Instagram" },
  { icon: <FaWhatsapp   size={15} />, href: "https://wa.me/601139936766", label: "WhatsApp" },
];

const FooterA = () => {
  return (
    <footer>
      {/* CTA strip */}
      <div className="bg-gold-500 px-6 py-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <motion.div variants={fadeUp} custom={0}>
            <p className="text-navy-900 font-extrabold text-2xl">
              Ready to invest in your team?
            </p>
            <p className="text-navy-800 text-sm mt-1">
              Get in touch and let us build the right program for you.
            </p>
          </motion.div>
          <motion.a
            variants={fadeUp}
            custom={1}
            href="mailto:info@ika-edu.com"
            whileHover={{ scale: 1.03 }}
            className="flex items-center gap-2 bg-navy-900 text-white font-bold px-7 py-3.5 rounded-full text-sm hover:bg-navy-800 transition-colors flex-shrink-0"
          >
            Request a Program <MdArrowForward size={16} />
          </motion.a>
        </motion.div>
      </div>

      {/* Main footer */}
      <div className="bg-navy-900 px-6 pt-16 pb-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-navy-700"
          >
            {/* Brand — 4 cols */}
            <motion.div variants={fadeUp} custom={0} className="md:col-span-4">
              <img src="/brand/IKA-logo-bg.png" alt="IKA" className="h-12 w-auto mb-5 brightness-200" />
              <p className="text-navy-300 text-sm leading-relaxed max-w-xs">
                International Knowledge Academy for Training and Management Development —
                empowering professionals across 10 countries and 20+ specialized fields.
              </p>
              <p className="text-gold-500 text-xs mt-4 italic leading-relaxed">
                "Invest in Your Employees and Invest in the Future of Your Institution."
              </p>
              {/* Socials */}
              <div className="flex items-center gap-2 mt-6">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="w-9 h-9 rounded-full bg-navy-700 text-navy-300 hover:bg-gold-500 hover:text-navy-900 flex items-center justify-center transition-all duration-200"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Quick Links — 2 cols */}
            <motion.div variants={fadeUp} custom={1} className="md:col-span-2">
              <h4 className="text-white font-semibold text-xs uppercase tracking-widest mb-5">
                Pages
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((l) => (
                  <li key={l.to + l.label}>
                    <Link to={l.to} className="text-navy-300 text-sm hover:text-gold-400 transition-colors flex items-center gap-1.5 group">
                      <span className="w-1 h-1 rounded-full bg-gold-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Programs — 2 cols */}
            <motion.div variants={fadeUp} custom={2} className="md:col-span-3">
              <h4 className="text-white font-semibold text-xs uppercase tracking-widest mb-5">
                Programs
              </h4>
              <ul className="space-y-3">
                {programs.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-navy-300 text-sm hover:text-gold-400 transition-colors flex items-center gap-1.5 group">
                      <span className="w-1 h-1 rounded-full bg-gold-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact — 3 cols */}
            <motion.div variants={fadeUp} custom={3} className="md:col-span-3">
              <h4 className="text-white font-semibold text-xs uppercase tracking-widest mb-5">
                Contact
              </h4>
              <ul className="space-y-3">
                {[
                  { icon: <MdEmail size={15} />, text: "info@ika-edu.com", href: "mailto:info@ika-edu.com" },
                  { icon: <MdPhone size={15} />, text: "+601139936766", href: "https://wa.me/601139936766" },
                  { icon: <MdLanguage size={15} />, text: "www.ika-edu.com", href: "https://www.ika-edu.com" },
                  { icon: <MdLocationOn size={15} />, text: "UAE · UK · Europe · Asia", href: null },
                ].map((item) => (
                  <li key={item.text}>
                    {item.href ? (
                      <a href={item.href} target="_blank" rel="noreferrer"
                        className="flex items-center gap-2.5 text-navy-300 text-sm hover:text-gold-400 transition-colors group"
                      >
                        <span className="text-gold-500 group-hover:text-gold-400 flex-shrink-0">{item.icon}</span>
                        {item.text}
                      </a>
                    ) : (
                      <span className="flex items-center gap-2.5 text-navy-300 text-sm">
                        <span className="text-gold-500 flex-shrink-0">{item.icon}</span>
                        {item.text}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>

          {/* Bottom bar */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-navy-400 text-xs">
              © {new Date().getFullYear()} International Knowledge Academy. All rights reserved.
            </p>
            <div className="flex items-center gap-5">
              <a href="#" className="text-navy-400 text-xs hover:text-gold-400 transition-colors">Privacy Policy</a>
              <span className="text-navy-700">·</span>
              <a href="#" className="text-navy-400 text-xs hover:text-gold-400 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterA;
