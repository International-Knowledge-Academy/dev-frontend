// @ts-nocheck
// OPTION C — Minimal centered dark — clean, elegant, premium
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaLinkedinIn, FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

const navLinks = [
  { label: "Home",        to: "/" },
  { label: "About",       to: "/about" },
  { label: "Programs",    to: "/training" },
  { label: "Instructors", to: "/instructors" },
  { label: "Contact",     to: "/contact" },
];

const socials = [
  { icon: <FaLinkedinIn size={14} />, href: "#",                          label: "LinkedIn" },
  { icon: <FaFacebookF  size={14} />, href: "#",                          label: "Facebook" },
  { icon: <FaInstagram  size={14} />, href: "#",                          label: "Instagram" },
  { icon: <FaWhatsapp   size={14} />, href: "https://wa.me/601139936766", label: "WhatsApp" },
];

const FooterC = () => {
  return (
    <footer className="bg-navy-900 px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-3xl mx-auto text-center"
      >
        {/* Logo */}
        <img
          src="/brand/IKA-logo-bg.png"
          alt="IKA"
          className="h-14 w-auto mx-auto mb-6 brightness-200"
        />

        {/* Tagline */}
        <p className="text-gold-500 text-sm italic mb-8">
          "Invest in Your Employees and Invest in the Future of Your Institution."
        </p>

        {/* Gold divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-navy-700" />
          <div className="w-1.5 h-1.5 rounded-full bg-gold-500" />
          <div className="flex-1 h-px bg-navy-700" />
        </div>

        {/* Nav links */}
        <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mb-8">
          {navLinks.map((l) => (
            <Link
              key={l.to + l.label}
              to={l.to}
              className="text-navy-300 text-sm font-medium hover:text-gold-400 transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Social icons */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              aria-label={s.label}
              className="w-9 h-9 rounded-full border border-navy-600 text-navy-300 hover:border-gold-500 hover:text-gold-500 flex items-center justify-center transition-all duration-200"
            >
              {s.icon}
            </a>
          ))}
        </div>

        {/* Contact row */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-navy-400 text-xs mb-10">
          <a href="mailto:info@ika-edu.com" className="hover:text-gold-400 transition-colors">
            info@ika-edu.com
          </a>
          <span className="text-navy-700">·</span>
          <a href="https://wa.me/601139936766" target="_blank" rel="noreferrer" className="hover:text-gold-400 transition-colors">
            +601139936766
          </a>
          <span className="text-navy-700">·</span>
          <a href="https://www.ika-edu.com" target="_blank" rel="noreferrer" className="hover:text-gold-400 transition-colors">
            www.ika-edu.com
          </a>
        </div>

        {/* Gold divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-navy-700" />
          <div className="w-1.5 h-1.5 rounded-full bg-gold-500" />
          <div className="flex-1 h-px bg-navy-700" />
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-navy-500 text-xs">
          <p>© {new Date().getFullYear()} International Knowledge Academy</p>
          <span className="hidden sm:block text-navy-700">·</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gold-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gold-400 transition-colors">Terms</a>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default FooterC;
