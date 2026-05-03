// @ts-nocheck
import { useState, useRef, useEffect } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

interface DropdownItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}

interface DropdownButtonProps {
  label: string;
  icon?: React.ReactNode;
  items: DropdownItem[];
  variant?: "primary" | "outline";
}

const DropdownButton = ({ label, icon, items, variant = "primary" }: DropdownButtonProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const triggerClass =
    variant === "primary"
      ? "bg-navy-800 text-white hover:bg-navy-700 border-navy-800"
      : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200";

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition ${triggerClass}`}
      >
        {icon && <span className="flex items-center">{icon}</span>}
        {label}
        <MdKeyboardArrowDown
          size={16}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white border border-slate-100 shadow-lg z-50 overflow-hidden">
          {items.map((item, i) => (
            <button
              key={i}
              type="button"
              onClick={() => { item.onClick(); setOpen(false); }}
              className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-sm font-medium transition text-left
                ${item.danger
                  ? "text-red-500 hover:bg-red-50"
                  : "text-navy-700 hover:bg-navy-50"
                }`}
            >
              {item.icon && <span className="flex items-center text-current">{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownButton;
