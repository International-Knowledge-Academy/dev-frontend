// @ts-nocheck
import React, { useState, useEffect } from "react";
import { MdSearch } from "react-icons/md";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
};

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  debounceMs = 400,
}) => {
  const [local, setLocal] = useState(value);

  // Sync if parent resets the value (e.g. clear filters)
  useEffect(() => {
    setLocal(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(local);
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [local]);

  return (
    <div className={`relative flex-1 max-w-sm ${className}`}>
      <MdSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        className="w-full pl-9 pr-4 py-2.5 rounded-md border border-gray-200 bg-gray-50 text-sm text-navy-800 outline-none focus:ring-2 focus:ring-navy-300 dark:bg-navy-800 dark:text-white dark:border-navy-700"
      />
    </div>
  );
};

export default SearchInput;
