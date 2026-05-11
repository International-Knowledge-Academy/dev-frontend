// @ts-nocheck
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  MdMenu, MdClose, MdKeyboardArrowDown,
  MdArrowForward, MdGridView, MdMenuBook,
  MdSchool, MdWorkspacePremium,
} from "react-icons/md";

import useCategories from "hooks/categories/useCategories";

/* ── Shared dropdown item ─────────────────────────────────────────────────── */
function DropdownItem({ item, onClick = undefined }) {
  return (
    <Link
      to={item.to}
      onClick={onClick}
      className="group flex items-center gap-3 px-3 py-2.5 rounded-md lg:rounded-lg hover:bg-navy-50 transition-colors duration-150"
    >
      <div className="w-8 h-8 rounded-md lg:rounded-lg bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center flex-shrink-0 group-hover:bg-navy-700 group-hover:text-white group-hover:border-navy-700 transition-all duration-150">
        {item.icon || <MdMenuBook size={15} />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-navy-800 group-hover:text-navy-700 leading-tight">
          {item.label}
        </p>
        {item.description && (
          <p className="text-xs text-slate-400 mt-0.5 leading-tight truncate">
            {item.description}
          </p>
        )}
      </div>
      <MdArrowForward
        size={13}
        className="flex-shrink-0 text-slate-300 group-hover:text-gold-500 group-hover:translate-x-0.5 transition-all duration-150"
      />
    </Link>
  );
}

/* ── Plain dropdown (generic) ─────────────────────────────────────────────── */
function Dropdown({ items, visible }) {
  return (
    <div
      className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[300px] z-50 ${
        visible ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <div
        className={`rounded-xl bg-white shadow-xl border border-slate-100 overflow-hidden transition-all duration-200 origin-top ${
          visible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-1"
        }`}
      >
        <div className="h-0.5 bg-gradient-to-r from-navy-700 via-navy-500 to-gold-400" />
        <div className="p-1.5">
          {items.map((item) => (
            <DropdownItem key={item.to} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Categories dropdown ──────────────────────────────────────────────────── */
function CategoriesDropdown({ link, visible }) {
  return (
    <div
      className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[300px] z-50 ${
        visible ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <div
        className={`rounded-xl bg-white shadow-xl border border-slate-100 overflow-hidden transition-all duration-200 origin-top ${
          visible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-1"
        }`}
      >
        <div className="h-0.5 bg-gradient-to-r from-navy-700 via-navy-500 to-gold-400" />

        <div className="px-4 pt-3 pb-2 border-b border-slate-50">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Browse Categories
          </p>
        </div>

        <div className="p-1.5 max-h-64 overflow-y-auto">
          {link.children.length === 0 ? (
            <p className="text-xs text-slate-400 px-3 py-2.5">No categories yet</p>
          ) : (
            link.children.map((item) => (
              <DropdownItem key={item.to} item={item} />
            ))
          )}
        </div>

        <div className="px-4 py-2.5 border-t border-slate-50 bg-slate-50/50">
          <Link
            to={link.to}
            className="flex items-center justify-between text-xs font-semibold text-navy-600 hover:text-gold-600 transition-colors group"
          >
            <span className="flex items-center gap-1.5">
              <MdGridView size={13} />
              View All Categories
            </span>
            <MdArrowForward
              size={12}
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

  const baseCls = `relative text-sm font-medium pb-0.5 transition-colors group ${
    isActive ? "text-gold-500" : "text-slate-600 hover:text-navy-800"
  }`;

  const underline = (
    <span
      className={`absolute -bottom-0.5 left-0 h-[2px] rounded-full bg-gold-400 transition-all duration-200 ${
        isActive ? "w-full" : "w-0 group-hover:w-full"
      }`}
    />
  );

  if (!hasChildren) {
    return (
      <Link to={link.to} className={baseCls}>
        {link.label}
        {underline}
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
        className={`flex items-center gap-0.5 ${baseCls}`}
      >
        {link.label}
        <MdKeyboardArrowDown
          size={14}
          className={`mt-0.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
        {underline}
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
    { label: "Home",      to: "/" },
    { label: "About",     to: "/about" },
    {
      label: "Categories",
      to: "/categories",
      dropdown: "categories",
      children: categories.map((c) => ({
        label: c.name,
        description: c.summary || "Explore programs in this category",
        to: `/category/${c.uid}`,
      })),
    },
    { label: "Programs",  to: "/programs" },
    { label: "Contact",   to: "/contact" },
    {
      label: "Register",
      to: "/register",
      children: [
        {
          label: "Register for Programs",
          description: "Apply for available programs and training opportunities.",
          icon: <MdSchool size={16} />,
          to: "/register/program",
        },
        {
          label: "Become a Trainer",
          description: "Join our trainer network and share your expertise.",
          icon: <MdWorkspacePremium size={16} />,
          to: "/register/trainer",
        },
      ],
    },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-6xl mt-3 z-50 rounded-xl transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg shadow-navy-900/8 border border-slate-200/80"
          : "bg-white/90 backdrop-blur-sm border border-slate-100 shadow-sm"
      }`}
    >
      <div className="px-5 sm:px-8 h-[80px] flex items-center justify-between gap-6">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 flex-shrink-0">
          <img src="/brand/IKA-logo-bg.png" alt="IKA Logo" className="h-16 w-auto" />
          <div className="hidden sm:block">
            <p className="text-navy-800 font-bold text-sm leading-tight">
              International Knowledge Academy
            </p>
            <p className="text-gold-600 text-[10px] font-medium tracking-wide">
              for Training & Management Development
            </p>
          </div>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-7 flex-1 justify-center">
          {navLinks.map((link) => (
            <NavItem key={link.to} link={link} pathname={pathname} />
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
          <Link
            to="/auth/sign-in"
            className="text-sm font-semibold text-slate-600 hover:text-navy-800 transition-colors px-3.5 py-2 rounded-md lg:rounded-lg hover:bg-slate-50"
          >
            Sign In
          </Link>
          <Link
            to="/auth/sign-in"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-navy-700 hover:bg-navy-800 px-4 py-2 rounded-md lg:rounded-lg transition-all shadow-sm hover:shadow-md"
          >
            Get Started
            <MdArrowForward size={14} />
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => { if (menuOpen) setMobileExpanded(null); setMenuOpen(!menuOpen); }}
          className="lg:hidden flex items-center justify-center w-9 h-9 rounded-md lg:rounded-lg text-slate-600 hover:text-navy-800 hover:bg-slate-50 transition"
        >
          {menuOpen ? <MdClose size={20} /> : <MdMenu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-slate-100 px-4 py-4 flex flex-col gap-1">
          {navLinks.map((link) => {
            const hasChildren = link.children?.length > 0;
            const isExpanded  = mobileExpanded === link.to;
            const isActive    = pathname === link.to;

            return (
              <div key={link.to}>
                {hasChildren ? (
                  <>
                    <button
                      onClick={() => setMobileExpanded(isExpanded ? null : link.to)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-md lg:rounded-lg text-sm font-medium transition ${
                        isActive
                          ? "text-gold-500 bg-gold-50"
                          : "text-slate-700 hover:bg-slate-50 hover:text-navy-800"
                      }`}
                    >
                      {link.label}
                      <MdKeyboardArrowDown
                        size={16}
                        className={`text-slate-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="ml-3 mt-0.5 mb-1 pl-3 border-l-2 border-slate-100 flex flex-col gap-0.5">
                        {link.children.map((child) => (
                          <Link
                            key={child.to}
                            to={child.to}
                            onClick={() => { setMenuOpen(false); setMobileExpanded(null); }}
                            className="group flex items-center gap-2.5 px-2.5 py-2 rounded-md lg:rounded-lg hover:bg-navy-50 transition"
                          >
                            <div className="w-7 h-7 rounded-md border border-slate-100 bg-slate-50 text-slate-400 flex items-center justify-center flex-shrink-0 group-hover:bg-navy-700 group-hover:text-white group-hover:border-navy-700 transition-all">
                              {child.icon || <MdMenuBook size={14} />}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-navy-700 leading-tight">
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
                            className="flex items-center gap-2 px-2.5 py-2 rounded-md lg:rounded-lg bg-slate-50 hover:bg-navy-50 transition"
                          >
                            <MdGridView size={14} className="text-navy-400" />
                            <span className="text-sm font-semibold text-navy-600">
                              View All Categories
                            </span>
                          </Link>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className={`block px-3.5 py-2.5 rounded-md lg:rounded-lg text-sm font-medium transition ${
                      isActive
                        ? "text-gold-500 bg-gold-50"
                        : "text-slate-700 hover:bg-slate-50 hover:text-navy-800"
                    }`}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            );
          })}

          <div className="mt-3 pt-4 border-t border-slate-100 flex flex-col gap-2.5">
            <Link
              to="/auth/sign-in"
              onClick={() => setMenuOpen(false)}
              className="px-4 py-2.5 rounded-md lg:rounded-lg text-sm font-semibold text-center text-slate-700 border border-slate-200 hover:bg-slate-50 transition"
            >
              Sign In
            </Link>
            <Link
              to="/auth/sign-in"
              onClick={() => setMenuOpen(false)}
              className="inline-flex items-center justify-center gap-1.5 bg-navy-700 hover:bg-navy-800 text-white text-sm font-semibold px-5 py-2.5 rounded-md lg:rounded-lg transition"
            >
              Get Started
              <MdArrowForward size={14} />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
