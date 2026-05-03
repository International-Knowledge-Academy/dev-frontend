// @ts-nocheck
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  MdMenu, MdClose, MdKeyboardArrowDown,
  MdArrowForward, MdGridView, MdMenuBook,
} from "react-icons/md";
import useCategories from "hooks/categories/useCategories";

/* ── Plain dropdown (generic) ─────────────────────────────────────────────── */
function Dropdown({ items, visible }) {
  return (
    <div
      className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 w-52 z-50 ${
        visible ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <div
        className={`rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden transition-all duration-200 origin-top ${
          visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
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
    </div>
  );
}

/* ── Categories rich dropdown (dynamic) ──────────────────────────────────── */
function CategoriesDropdown({ link, visible }) {
  return (
    <div
      className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[320px] z-50 ${
        visible ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <div
        className={`rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden transition-all duration-200 origin-top ${
          visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div className="px-4 pt-4 pb-3 border-b border-slate-50">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
            Browse Categories
          </p>
        </div>

        <div className="p-2 max-h-72 overflow-y-auto">
          {link.children.length === 0 ? (
            <p className="text-xs text-slate-400 px-4 py-3">No categories yet</p>
          ) : (
            link.children.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="group flex items-center gap-3.5 px-3 py-3 rounded-xl hover:bg-navy-50 transition-colors duration-150"
              >
                <div className="w-9 h-9 rounded-lg bg-navy-50 text-navy-500 flex items-center justify-center flex-shrink-0 group-hover:bg-gold-50 group-hover:text-gold-600 transition-colors duration-150">
                  <MdMenuBook size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-navy-800 group-hover:text-navy-600 leading-tight">
                    {item.label}
                  </p>
                  {item.description && (
                    <p className="text-xs text-slate-400 mt-0.5 leading-tight truncate">
                      {item.description}
                    </p>
                  )}
                </div>
                <MdArrowForward
                  size={14}
                  className="flex-shrink-0 text-slate-300 group-hover:text-gold-500 group-hover:translate-x-0.5 transition-all duration-150"
                />
              </Link>
            ))
          )}
        </div>

        <div className="px-4 py-3 border-t border-slate-50 bg-slate-50/60">
          <Link
            to={link.to}
            className="flex items-center justify-between text-xs font-semibold text-navy-600 hover:text-gold-600 transition-colors group"
          >
            <span className="flex items-center gap-1.5">
              <MdGridView size={14} />
              View All Categories
            </span>
            <MdArrowForward
              size={13}
              className="group-hover:translate-x-0.5 transition-transform duration-150"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── Nav item ─────────────────────────────────────────────────────────────── */
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

      {link.dropdown === "categories" ? (
        <CategoriesDropdown link={link} visible={open} />
      ) : (
        <Dropdown items={link.children} visible={open} />
      )}
    </div>
  );
}

/* ── Navbar ───────────────────────────────────────────────────────────────── */
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const { categories } = useCategories();

  const navLinks = [
    { label: "Home",     to: "/" },
    { label: "About",    to: "/about" },
    {
      label: "Categories",
      to: "/categories",
      dropdown: "categories",
      children: categories.map((c) => ({
        label: c.name,
        description: c.summary || "Explore programs in this category",
        to: `/categories`,
      })),
    },
    { label: "Programs", to: "/programs" },
    { label: "Contact",  to: "/contact" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-1/2 -translate-x-1/2 w-[calc(100%-40px)] max-w-6xl rounded-xl mt-3 z-50 transition-all duration-300 ${
        scrolled ? "shadow-md shadow-navy-900/10 bg-white" : "bg-white"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-[72px] flex items-center justify-between gap-8">

        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <img src="/brand/IKA-logo-bg.png" alt="IKA Logo" className="h-11 w-auto" />
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-7 flex-1 justify-center">
          {navLinks.map((link) => (
            <NavItem key={link.to} link={link} pathname={pathname} />
          ))}
        </div>

        {/* Desktop Right CTAs */}
        <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
          <Link
            to="/auth/sign-in"
            className="text-sm font-semibold text-navy-700 hover:text-navy-900 transition px-4 py-2 rounded-full hover:bg-navy-50"
          >
            Sign In
          </Link>
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
        <div className="lg:hidden bg-white border-t border-slate-100 px-5 py-4 flex flex-col gap-1 shadow-lg">
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
                      <div className="ml-2 mt-1 mb-1 flex flex-col gap-0.5">
                        {link.children.map((child) => (
                          <Link
                            key={child.to}
                            to={child.to}
                            onClick={() => { setMenuOpen(false); setMobileExpanded(null); }}
                            className="group flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-navy-50 transition"
                          >
                            <div className="w-8 h-8 rounded-lg bg-navy-50 text-navy-500 flex items-center justify-center flex-shrink-0 group-hover:bg-gold-50 group-hover:text-gold-600 transition-colors">
                              <MdMenuBook size={15} />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-navy-700 group-hover:text-navy-600 leading-tight">
                                {child.label}
                              </p>
                              {child.description && (
                                <p className="text-xs text-slate-400 leading-tight mt-0.5 truncate max-w-[200px]">
                                  {child.description}
                                </p>
                              )}
                            </div>
                          </Link>
                        ))}
                        {link.dropdown === "categories" && (
                          <Link
                            to={link.to}
                            onClick={() => { setMenuOpen(false); setMobileExpanded(null); }}
                            className="flex items-center gap-2 px-3 py-2.5 mt-1 rounded-xl bg-slate-50 hover:bg-navy-50 transition"
                          >
                            <MdGridView size={15} className="text-navy-400" />
                            <span className="text-sm font-semibold text-navy-600">View All Categories</span>
                          </Link>
                        )}
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

          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-2">
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
