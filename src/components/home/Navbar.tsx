// @ts-nocheck
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { MdMenu, MdClose, MdKeyboardArrowDown } from "react-icons/md";

const navLinks = [
  { label: "Home", to: "/" },
  {
    label: "About",
    to: "/about",
    children: [
      { label: "Our Mission", to: "/about#mission" },
      { label: "Our Team", to: "/about#team" },
    ],
  },
  { label: "Programs", to: "/programs" },
  { label: "Instructors", to: "/instructors" },
  { label: "Reviews", to: "/reviews" },
  { label: "Contact", to: "/contact" },
];

function Dropdown({ items, visible }) {
  return (
    <div
      className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 w-52 rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden transition-all duration-200 origin-top z-50 ${
        visible
          ? "opacity-100 scale-100 pointer-events-auto"
          : "opacity-0 scale-95 pointer-events-none"
      }`}
    >
      <div className="p-1.5">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-navy-800 hover:bg-navy-50 hover:text-navy-600 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 flex-shrink-0" />
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function NavItem({ link, pathname }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const hasChildren = link.children?.length > 0;
  const isActive =
    pathname === link.to ||
    (hasChildren && link.children.some((c) => pathname === c.to));

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const linkCls = `relative text-sm font-medium transition-colors ${
    isActive ? "text-gold-500" : "text-navy-700 hover:text-gold-500"
  }`;

  if (!hasChildren) {
    return (
      <Link to={link.to} className={linkCls}>
        {link.label}
      </Link>
    );
  }

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-0.5 ${linkCls}`}
      >
        {link.label}
        <MdKeyboardArrowDown
          size={15}
          className={`mt-0.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <Dropdown items={link.children} visible={open} />
    </div>
  );
}

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl rounded-xl mt-3 z-50 transition-all duration-300 ${
        scrolled ? "shadow-md shadow-navy-900/10 bg-white" : "bg-white"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-[72px] flex items-center justify-between gap-8">

        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <img src="/brand/IKA-logo-bg.png" alt="IKA Logo" className="h-11 w-auto" />
        </Link>

        {/* Desktop Nav Links — centered */}
        <div className="hidden lg:flex items-center gap-7 flex-1 justify-center">
          {navLinks.map((link) => (
            <NavItem key={link.to} link={link} pathname={pathname} />
          ))}
        </div>

        {/* Desktop Right — cart + CTAs */}
        <div className="hidden lg:flex items-center gap-3 flex-shrink-0">

          {/* Sign In */}
          <Link
            to="/auth/sign-in"
            className="text-sm font-semibold text-navy-700 hover:text-navy-900 transition px-4 py-2 rounded-full hover:bg-navy-50"
          >
            Sign In
          </Link>

          {/* Get Started */}
          <Link
            to="/auth/sign-in"
            className="text-sm font-semibold text-white bg-navy-600 hover:bg-navy-700 px-6 py-2.5 rounded-full transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            Get Started
          </Link>

        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-navy-700 hover:text-gold-500 transition p-1"
          onClick={() => { if (menuOpen) setMobileExpanded(null); setMenuOpen(!menuOpen); }}
        >
          {menuOpen ? <MdClose size={26} /> : <MdMenu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-5 py-4 flex flex-col gap-1 shadow-lg">
          {navLinks.map((link) => {
            const hasChildren = link.children?.length > 0;
            const isExpanded = mobileExpanded === link.to;
            const isActive = pathname === link.to;

            return (
              <div key={link.to}>
                {hasChildren ? (
                  <>
                    <button
                      onClick={() => setMobileExpanded(isExpanded ? null : link.to)}
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                        isActive ? "text-gold-500" : "text-navy-700 hover:bg-navy-50 hover:text-gold-500"
                      }`}
                    >
                      {link.label}
                      <MdKeyboardArrowDown
                        size={16}
                        className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isExpanded && (
                      <div className="ml-4 mt-1 flex flex-col gap-0.5">
                        {link.children.map((child) => (
                          <Link
                            key={child.to}
                            to={child.to}
                            onClick={() => { setMenuOpen(false); setMobileExpanded(null); }}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-navy-500 hover:bg-navy-50 hover:text-navy-700 transition"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 flex-shrink-0" />
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                      isActive
                        ? "text-gold-500 bg-gold-50"
                        : "text-navy-700 hover:bg-navy-50 hover:text-gold-500"
                    }`}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            );
          })}

          <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-2">
            <Link
              to="/auth/sign-in"
              onClick={() => setMenuOpen(false)}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-center text-navy-700 hover:bg-navy-50 transition"
            >
              Sign In
            </Link>
            <Link
              to="/auth/sign-in"
              onClick={() => setMenuOpen(false)}
              className="bg-navy-600 hover:bg-navy-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full text-center transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
