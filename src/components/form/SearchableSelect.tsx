// @ts-nocheck
import { useState, useRef, useEffect, useMemo } from "react";
import { MdExpandMore, MdClose } from "react-icons/md";

const getNestedValue = (obj, path) => {
  if (!path) return undefined;
  return path.split(/[\.\[\]]/).filter(Boolean).reduce((acc, key) => (acc ? acc[key] : undefined), obj);
};

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
}) => {
  const containerRef = useRef(null);
  const searchRef    = useRef(null);

  const selectedValue  = getNestedValue(formData, field) ?? "";
  const selectedOption = options.find((opt) => opt.value === selectedValue);
  const selectedLabel  = selectedOption?.label ?? selectedValue ?? "";
  const hasError       = !!getNestedValue(errors, field);

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = useMemo(
    () => options.filter((opt) => opt.label?.toLowerCase().includes(search.toLowerCase())),
    [search, options]
  );

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (isOpen) setTimeout(() => searchRef.current?.focus(), 30);
  }, [isOpen]);

  const handleSelect = (option) => {
    updateFormData(field, option.value);
    setIsOpen(false);
    setSearch("");
  };

  const handleClear = (e) => {
    e.stopPropagation();
    updateFormData(field, "");
    setSearch("");
  };

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-sm font-medium text-navy-800 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className={`w-full flex items-center justify-between gap-2 rounded-md lg:rounded-lg border bg-slate-50 px-4 py-2.5 text-sm text-left outline-none transition focus:ring-2 focus:ring-navy-300 ${
          hasError
            ? "border-red-400"
            : isOpen
            ? "border-navy-400 ring-2 ring-navy-300"
            : "border-slate-200"
        }`}
      >
        <span className={`flex-1 truncate ${selectedLabel ? "text-navy-800" : "text-slate-400"}`}>
          {selectedLabel || placeholder}
        </span>
        <span className="flex items-center gap-0.5 flex-shrink-0 text-slate-400">
          {selectedLabel && (
            <span onClick={handleClear} className="p-0.5 rounded hover:text-red-500 transition">
              <MdClose size={14} />
            </span>
          )}
          <MdExpandMore
            size={18}
            className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md lg:rounded-lg border border-slate-200 bg-white shadow-lg overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b border-slate-100">
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-navy-800 outline-none focus:ring-2 focus:ring-navy-300 focus:border-navy-400 transition"
            />
          </div>

          {/* Options */}
          <ul className="max-h-52 overflow-y-auto py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <li
                  key={opt.value}
                  onClick={() => handleSelect(opt)}
                  className={`px-4 py-2.5 text-sm cursor-pointer transition ${
                    opt.value === selectedValue
                      ? "bg-navy-50 text-navy-700 font-medium"
                      : "text-navy-800 hover:bg-slate-50"
                  }`}
                >
                  {opt.label}
                </li>
              ))
            ) : (
              <li className="px-4 py-3 text-sm text-slate-400 text-center">
                No results for "{search}"
              </li>
            )}

            {actions.length > 0 && filteredOptions.length === 0 && (
              <div className="border-t border-slate-100 mt-1 pt-1">
                {actions.map((action, i) => (
                  <li
                    key={i}
                    onClick={(e) => { e.stopPropagation(); action.onClick?.(); setIsOpen(false); setSearch(""); }}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-navy-600 hover:bg-navy-50 cursor-pointer transition"
                  >
                    {action.icon}
                    {action.label}
                  </li>
                ))}
              </div>
            )}
          </ul>
        </div>
      )}

      {hasError && (
        <p className="mt-1 text-xs text-red-500">{getNestedValue(errors, field)}</p>
      )}
    </div>
  );
};

export default SearchableSelect;
