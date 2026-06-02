// @ts-nocheck
import { useState, useRef, useEffect } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { Loader2 } from "lucide-react";

interface DropdownItem {
  label?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
  disabled?: boolean;
  divider?: boolean;
}

interface DropdownButtonProps {
  label: string;
  icon?: React.ReactNode;
  items: DropdownItem[];
  variant?: "primary" | "outline";
  loading?: boolean;
  disabled?: boolean;
  align?: "left" | "right";
}

const DropdownButton = ({
  label,
  icon,
  items,
  variant = "primary",
  loading = false,
  disabled = false,
  align = "right",
}: DropdownButtonProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onMouse);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onMouse);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const triggerClass =
    variant === "primary"
      ? "bg-navy-800 text-white hover:bg-navy-700 border-navy-800"
      : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200 shadow-sm";

  const alignClass = align === "left" ? "left-0" : "right-0";

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        disabled={disabled || loading}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-md lg:rounded-lg border text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed ${triggerClass}`}
      >
        {loading ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          icon && <span className="flex items-center">{icon}</span>
        )}
        {label}
        {!loading && (
          <MdKeyboardArrowDown
            size={16}
            className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        )}
      </button>

      <div
        className={`absolute ${alignClass} mt-2 w-52 rounded-xl bg-white border border-slate-100 shadow-xl z-50 overflow-hidden py-1.5 transition-all duration-200 origin-top ${
          open
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
        }`}
      >
        {items.map((item, i) =>
          item.divider ? (
            <div key={i} className="my-1.5 border-t border-slate-100" />
          ) : (
            <button
              key={i}
              type="button"
              disabled={item.disabled}
              onClick={() => {
                if (!item.disabled) {
                  item.onClick?.();
                  setOpen(false);
                }
              }}
              className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-sm font-medium transition text-left disabled:opacity-40 disabled:cursor-not-allowed ${
                item.danger
                  ? "text-red-500 hover:bg-red-50"
                  : "text-navy-700 hover:bg-navy-50"
              }`}
            >
              {item.icon && (
                <span className="flex items-center text-current flex-shrink-0">{item.icon}</span>
              )}
              {item.label}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default DropdownButton;
