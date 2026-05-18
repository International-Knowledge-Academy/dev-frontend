// @ts-nocheck
"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { ChevronDown, Check } from "lucide-react";

const getNestedValue = (obj, path) => {
  if (!path) return undefined;
  return path
    .split(/[.[\]]/)
    .filter(Boolean)
    .reduce((acc, key) => (acc ? acc[key] : undefined), obj);
};

const CreatableSelectField = ({
  label,
  field,
  options = [],
  required = true,
  formData,
  errors,
  updateFormData,
  placeholder = "Select...",
  disabledOptions = [],
  onSearchChange,
}) => {
  const triggerRef  = useRef(null);
  const dropdownRef = useRef(null);

  const selectedValue = getNestedValue(formData, field) ?? "";

  const [isOpen,        setIsOpen]        = useState(false);
  const [search,        setSearch]        = useState("");
  const [dropdownStyle, setDropdownStyle] = useState({});

  const selectedOption = options.find((opt) => opt.value === selectedValue);
  const selectedLabel  = selectedOption?.label ?? selectedValue ?? "";

  const filteredOptions = useMemo(() => {
    if (onSearchChange) return options;
    return options.filter(
      (opt) => opt.label && opt.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, options, onSearchChange]);

  const calculatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setDropdownStyle({
      position: "fixed",
      top:      rect.bottom + 4,
      left:     rect.left,
      width:    rect.width,
      zIndex:   9999,
    });
  };

  const open = () => {
    calculatePosition();
    setIsOpen(true);
  };

  const close = useCallback(() => {
    setIsOpen(false);
    setSearch("");
    onSearchChange?.("");
  }, [onSearchChange]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (
        triggerRef.current  && !triggerRef.current.contains(e.target) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target)
      ) {
        close();
      }
    };

    const handleScrollOrResize = () => {
      calculatePosition();
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll",  handleScrollOrResize, true);
    window.addEventListener("resize",  handleScrollOrResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll",  handleScrollOrResize, true);
      window.removeEventListener("resize",  handleScrollOrResize);
    };
  }, [isOpen, onSearchChange]);

  const handleSelect = (option) => {
    if (disabledOptions.includes(option.value)) return;
    updateFormData(field, option.value);
    close();
  };

  const hasError = !!getNestedValue(errors, field);

  return (
    <div className={label ? "mb-4" : ""}>

      {label && (
        <label className="block text-sm font-medium text-navy-800 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (isOpen ? close() : open())}
        className={`flex h-10 w-full items-center justify-between rounded-md lg:rounded-lg border bg-white px-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-navy-200 ${
          hasError
            ? "border-red-400"
            : isOpen
            ? "border-navy-400 ring-2 ring-navy-100"
            : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <span className={`truncate min-w-0 flex-1 text-left ${selectedLabel ? "text-navy-800" : "text-slate-400"}`}>
          {selectedLabel || placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`flex-shrink-0 ml-2 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown — fixed-positioned so it always escapes overflow/transform parents */}
      {isOpen && (
        <div
          ref={dropdownRef}
          style={dropdownStyle}
          className="rounded-md lg:rounded-lg border border-slate-200 bg-white shadow-lg overflow-hidden"
        >
          {/* Search */}
          <div className="p-2 border-b border-slate-100">
            <input
              type="text"
              placeholder="Search..."
              autoFocus
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                onSearchChange?.(e.target.value);
              }}
              className="h-8 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-navy-800 placeholder:text-slate-400 outline-none focus:border-navy-300 focus:bg-white transition-colors"
            />
          </div>

          {/* Options */}
          <ul className="max-h-48 overflow-y-auto py-1">
            {filteredOptions.map((opt) => {
              const isDisabled = disabledOptions.includes(opt.value);
              const isSelected = opt.value === selectedValue;

              return (
                <li
                  key={opt.value}
                  onClick={() => !isDisabled && handleSelect(opt)}
                  className={`flex items-center justify-between gap-2 px-3 py-2 text-sm transition-colors ${
                    isDisabled
                      ? "text-slate-400 cursor-not-allowed"
                      : isSelected
                      ? "bg-navy-50 text-navy-800 font-medium cursor-pointer"
                      : "text-navy-700 cursor-pointer hover:bg-slate-50"
                  }`}
                >
                  <span className="truncate min-w-0">{opt.label}</span>
                  {isSelected && <Check size={14} className="flex-shrink-0 text-navy-600" />}
                </li>
              );
            })}

            {!filteredOptions.length && (
              <li className="px-3 py-3 text-sm text-slate-400 text-center">
                No results found
              </li>
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

export default CreatableSelectField;
