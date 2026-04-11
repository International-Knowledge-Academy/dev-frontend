// @ts-nocheck
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">

          {/* Brand */}
          <div className="md:col-span-2">
            <img src="/brand/IKA-logo-bg.png" alt="IKA Logo" className="h-12 w-auto mb-4" />
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              International Knowledge Academy for Training and Management Development.
              Empowering professionals across the Middle East, Europe, and Asia.
            </p>
            <p className="text-gray-400 text-xs mt-3 italic">
              "Invest in Your Employees and Invest in the Future of Your Institution."
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-navy-800 font-semibold text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Home",     to: "/" },
                { label: "About",    to: "/about" },
                { label: "Programs", to: "/training" },
                { label: "Contact",  to: "/contact" },
                { label: "Sign In",  to: "/auth/sign-in" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-400 text-sm hover:text-gold-400 transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-navy-800 font-semibold text-sm uppercase tracking-wider mb-4">
              Contact
            </h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="mailto:info@ika-edu.com" className="hover:text-gold-400 transition">
                  info@ika-edu.com
                </a>
              </li>
              <li>
                <a href="https://wa.me/601139936766" target="_blank" rel="noreferrer" className="hover:text-gold-400 transition">
                  +601139936766
                </a>
              </li>
              <li>
                <a href="https://www.ika-edu.com" target="_blank" rel="noreferrer" className="hover:text-gold-400 transition">
                  www.ika-edu.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} International Knowledge Academy. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-gold-400 transition">Privacy Policy</a>
            <a href="#" className="hover:text-gold-400 transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
