// @ts-nocheck
import { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { MdExpandMore, MdClose } from "react-icons/md";

const getNestedValue = (obj, path) => {
  if (!path) return undefined;
  return path.split(/[.[\]]/).filter(Boolean).reduce((acc, key) => (acc ? acc[key] : undefined), obj);
};

const DROPDOWN_MAX_H = 260; // px — matches max-h-52 (208) + search bar (~52)

const SearchableSelect = ({
  label,
  field,
  options = [],
  required = false,
  formData,
  errors,
  updateFormData,
  placeholder = "Select...",
  actions = [],
  loading = false,
  disabled = false,
}) => {
  const triggerRef  = useRef(null);
  const dropRef     = useRef(null);
  const searchRef   = useRef(null);

  const selectedValue  = getNestedValue(formData, field) ?? "";
  const selectedOption = options.find((opt) => opt.value === selectedValue);
  const selectedLabel  = selectedOption?.label ?? "";
  const hasError       = !!getNestedValue(errors, field);

  const [isOpen,      setIsOpen]      = useState(false);
  const [search,      setSearch]      = useState("");
  const [activeIdx,   setActiveIdx]   = useState(-1);
  const [dropPos,     setDropPos]     = useState({ top: 0, left: 0, width: 0, openUp: false });

  const filteredOptions = useMemo(
    () => options.filter((o) => o.label?.toLowerCase().includes(search.toLowerCase())),
    [search, options]
  );

  /* ── position calculation ── */
  const calcPos = () => {
    if (!triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - r.bottom;
    const openUp = spaceBelow < DROPDOWN_MAX_H && r.top > spaceBelow;
    setDropPos({
      top:    openUp ? r.top - DROPDOWN_MAX_H - 4 : r.bottom + 4,
      left:   r.left,
      width:  r.width,
      openUp,
    });
  };

  /* ── open / close helpers ── */
  const open = () => {
    if (disabled || loading) return;
    calcPos();
    setIsOpen(true);
    setActiveIdx(-1);
  };

  const close = () => {
    setIsOpen(false);
    setSearch("");
    setActiveIdx(-1);
  };

  /* ── outside click ── */
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (
        !triggerRef.current?.contains(e.target) &&
        !dropRef.current?.contains(e.target)
      ) close();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  /* ── close on scroll / resize ── */
  useEffect(() => {
    if (!isOpen) return;
    const handler = () => close();
    window.addEventListener("scroll", handler, true);
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("scroll", handler, true);
      window.removeEventListener("resize", handler);
    };
  }, [isOpen]);

  /* ── auto-focus search ── */
  useEffect(() => {
    if (isOpen) setTimeout(() => searchRef.current?.focus(), 20);
  }, [isOpen]);

  /* ── keyboard — trigger ── */
  const handleTriggerKey = (e) => {
    if (["Enter", " ", "ArrowDown"].includes(e.key)) { e.preventDefault(); open(); }
  };

  /* ── keyboard — search input ── */
  const handleSearchKey = (e) => {
    if (e.key === "Escape")     { e.preventDefault(); close(); triggerRef.current?.focus(); return; }
    if (e.key === "ArrowDown")  { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, filteredOptions.length - 1)); return; }
    if (e.key === "ArrowUp")    { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, 0)); return; }
    if (e.key === "Enter" && activeIdx >= 0 && filteredOptions[activeIdx]) {
      e.preventDefault();
      handleSelect(filteredOptions[activeIdx]);
    }
  };

  const handleSelect = (opt) => {
    updateFormData(field, opt.value);
    close();
  };

  const handleClear = (e) => {
    e.stopPropagation();
    updateFormData(field, "");
  };

  /* ── portal dropdown ── */
  const dropdown = isOpen && createPortal(
    <div
      ref={dropRef}
      style={{ position: "fixed", top: dropPos.top, left: dropPos.left, width: dropPos.width, zIndex: 9999 }}
      className="rounded-md lg:rounded-lg border border-slate-200 bg-white shadow-lg overflow-hidden"
    >
      {/* Search */}
      <div className="p-2 border-b border-slate-100">
        <input
          ref={searchRef}
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setActiveIdx(-1); }}
          onKeyDown={handleSearchKey}
          placeholder="Search..."
          className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-navy-800 outline-none focus:ring-2 focus:ring-navy-300 focus:border-navy-400 transition"
        />
      </div>

      {/* Options */}
      <ul className="max-h-52 overflow-y-auto py-1">
        {loading ? (
          <li className="px-4 py-3 text-sm text-slate-400 text-center">Loading…</li>
        ) : filteredOptions.length > 0 ? (
          filteredOptions.map((opt, i) => (
            <li
              key={opt.value}
              onMouseDown={() => handleSelect(opt)}
              className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                i === activeIdx
                  ? "bg-navy-100 text-navy-800"
                  : opt.value === selectedValue
                  ? "bg-navy-50 text-navy-700 font-medium"
                  : "text-navy-800 hover:bg-slate-50"
              }`}
            >
              {opt.label}
            </li>
          ))
        ) : (
          <li className="px-4 py-3 text-sm text-slate-400 text-center">
            {search ? `No results for "${search}"` : "No options available"}
          </li>
        )}

        {actions.length > 0 && filteredOptions.length === 0 && !loading && (
          <div className="border-t border-slate-100 mt-1 pt-1">
            {actions.map((action, i) => (
              <li
                key={i}
                onMouseDown={(e) => { e.stopPropagation(); action.onClick?.(); close(); }}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-navy-600 hover:bg-navy-50 cursor-pointer transition"
              >
                {action.icon}
                {action.label}
              </li>
            ))}
          </div>
        )}
      </ul>
    </div>,
    document.body
  );

  return (
    <div className="relative mb-4">
      <label className="block text-sm font-medium text-navy-800 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <button
        ref={triggerRef}
        type="button"
        onClick={() => isOpen ? close() : open()}
        onKeyDown={handleTriggerKey}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between gap-2 rounded-md lg:rounded-lg border px-4 py-2.5 text-sm text-left outline-none transition ${
          disabled
            ? "bg-slate-100 cursor-not-allowed opacity-60"
            : isOpen
            ? "bg-white"
            : "bg-slate-50 hover:bg-white"
        } ${
          hasError
            ? isOpen ? "border-red-400 ring-2 ring-red-200" : "border-red-400"
            : isOpen ? "border-navy-400 ring-2 ring-navy-300" : "border-slate-200"
        }`}
      >
        <span className={`flex-1 truncate ${selectedLabel ? "text-navy-800" : "text-slate-400"}`}>
          {loading ? "Loading…" : selectedLabel || placeholder}
        </span>

        <span className="flex items-center gap-0.5 flex-shrink-0 text-slate-400">
          {selectedLabel && !disabled && (
            <span
              onClick={handleClear}
              className="p-0.5 rounded hover:text-red-500 transition cursor-pointer"
            >
              <MdClose size={14} />
            </span>
          )}
          <MdExpandMore
            size={18}
            className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </span>
      </button>

      {dropdown}

      {hasError && (
        <p className="mt-1 text-xs text-red-500">{getNestedValue(errors, field)}</p>
      )}
    </div>
  );
};

export default SearchableSelect;
