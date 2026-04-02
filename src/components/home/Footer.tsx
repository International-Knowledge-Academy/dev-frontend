// @ts-nocheck
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-navy-900 border-t border-navy-700 px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          {/* Brand */}
          <div>
            <h3 className="text-white font-extrabold text-xl mb-3">
              IKA<span className="text-gold-400">.</span>
            </h3>
            <p className="text-navy-300 text-sm leading-relaxed">
              A powerful platform built to help teams manage work, track progress, and grow with confidence.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Navigation
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Home",    to: "/" },
                { label: "About",   to: "/about" },
                { label: "Sign In", to: "/auth/sign-in" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-navy-300 text-sm hover:text-gold-400 transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Contact
            </h4>
            <ul className="space-y-2 text-navy-300 text-sm">
              <li>support@ika.com</li>
              <li>+1 (800) 123-4567</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-navy-700 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-navy-400 text-sm">
          <p>© {new Date().getFullYear()} IKA. All rights reserved.</p>
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
