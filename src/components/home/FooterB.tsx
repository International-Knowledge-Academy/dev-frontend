// @ts-nocheck
// OPTION B — Split footer: navy left panel + light right columns
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MdEmail, MdPhone, MdLanguage, MdArrowOutward } from "react-icons/md";
import { FaLinkedinIn, FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

const socials = [
  { icon: <FaLinkedinIn size={14} />, href: "#",                          label: "LinkedIn" },
  { icon: <FaFacebookF  size={14} />, href: "#",                          label: "Facebook" },
  { icon: <FaInstagram  size={14} />, href: "#",                          label: "Instagram" },
  { icon: <FaWhatsapp   size={14} />, href: "https://wa.me/601139936766", label: "WhatsApp" },
];

const columns = [
  {
    heading: "Explore",
    links: [
      { label: "Home",        to: "/" },
      { label: "About IKA",   to: "/about" },
      { label: "Programs",    to: "/training" },
      { label: "Instructors", to: "/instructors" },
      { label: "Contact",     to: "/contact" },
    ],
  },
  {
    heading: "Programs",
    links: [
      { label: "Training Courses",    to: "/training" },
      { label: "Training Diplomas",   to: "/training" },
      { label: "Contracted Programs", to: "/training" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy",  to: "#" },
      { label: "Terms of Service", to: "#" },
    ],
  },
];

const FooterB = () => {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5">

          {/* LEFT — navy panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-2 bg-navy-900 px-10 py-14 flex flex-col justify-between rounded-tl-none rounded-tr-none lg:rounded-none"
          >
            <div>
              <img src="/brand/IKA-logo-bg.png" alt="IKA" className="h-12 w-auto mb-8 brightness-200" />

              <p className="text-navy-200 text-sm leading-relaxed mb-6">
                Building excellence through knowledge — empowering professionals and organizations
                across the Middle East, Europe, and Asia.
              </p>

              <p className="text-gold-500 text-sm italic leading-relaxed border-l-2 border-gold-500 pl-4">
                "Invest in Your Employees and Invest in the Future of Your Institution."
              </p>
            </div>

            <div>
              {/* Socials */}
              <div className="flex gap-2 mt-10 mb-6">
                {socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                    className="w-9 h-9 rounded-full border border-navy-600 text-navy-300 hover:border-gold-500 hover:text-gold-500 flex items-center justify-center transition-all duration-200"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>

              {/* Contact inline */}
              <div className="space-y-2">
                {[
                  { icon: <MdEmail size={13} />, text: "info@ika-edu.com", href: "mailto:info@ika-edu.com" },
                  { icon: <MdPhone size={13} />, text: "+601139936766",     href: "https://wa.me/601139936766" },
                  { icon: <MdLanguage size={13} />, text: "www.ika-edu.com", href: "https://www.ika-edu.com" },
                ].map((item) => (
                  <a key={item.text} href={item.href} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 text-navy-300 text-xs hover:text-gold-400 transition-colors group"
                  >
                    <span className="text-gold-500">{item.icon}</span>
                    {item.text}
                    <MdArrowOutward size={11} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* RIGHT — light columns */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-3 px-10 py-14 flex flex-col justify-between bg-slate-50"
          >
            <div className="grid grid-cols-3 gap-8">
              {columns.map((col, ci) => (
                <div key={col.heading}>
                  <h4 className="text-navy-800 font-bold text-xs uppercase tracking-widest mb-5">
                    {col.heading}
                  </h4>
                  <ul className="space-y-3">
                    {col.links.map((l, li) => (
                      <motion.li
                        key={l.label}
                        initial={{ opacity: 0, x: 10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.35, delay: ci * 0.06 + li * 0.04 }}
                      >
                        <Link to={l.to}
                          className="text-gray-400 text-sm hover:text-navy-700 transition-colors"
                        >
                          {l.label}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Stats row */}
            <div className="mt-12 pt-8 border-t border-gray-200 grid grid-cols-3 gap-4 text-center">
              {[
                { val: "20+", label: "Training Fields" },
                { val: "10",  label: "Countries" },
                { val: "100%", label: "Accredited" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-extrabold text-navy-600">{s.val}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="bg-navy-900 px-10 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-navy-400 text-xs">
            © {new Date().getFullYear()} International Knowledge Academy. All rights reserved.
          </p>
          <div className="flex gap-5">
            <a href="#" className="text-navy-400 text-xs hover:text-gold-400 transition-colors">Privacy</a>
            <a href="#" className="text-navy-400 text-xs hover:text-gold-400 transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterB;
