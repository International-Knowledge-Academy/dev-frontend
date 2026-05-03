// @ts-nocheck
import { useRef } from "react";
import { motion } from "framer-motion";
import { MdSchool, MdWorkspacePremium, MdHandshake } from "react-icons/md";

const TYPES = [
  { value: null,         label: "All Programs",       icon: <MdWorkspacePremium size={16} /> },
  { value: "course",     label: "Training Courses",   icon: <MdSchool size={16} /> },
  { value: "diploma",    label: "Training Diplomas",  icon: <MdWorkspacePremium size={16} /> },
  { value: "contracted", label: "Contracted Programs",icon: <MdHandshake size={16} /> },
];

interface Props {
  selected: string | null;
  counts: Record<string, number>;
  total: number;
  onSelect: (type: string | null) => void;
}

const TypeTabs = ({ selected, counts, total, onSelect }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const getCount = (value: string | null) =>
    value === null ? total : (counts[value] ?? 0);

  return (
    <div className="sticky top-0 z-20 bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-6">
        <div
          ref={scrollRef}
          className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide"
        >
          {TYPES.map((t) => {
            const isActive = selected === t.value;
            const count = getCount(t.value);
            return (
              <button
                key={t.label}
                onClick={() => onSelect(t.value)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                  isActive
                    ? "bg-navy-800 text-white shadow-md"
                    : "text-slate-500 hover:text-navy-700 hover:bg-slate-50"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="type-tab-pill"
                    className="absolute inset-0 rounded-xl bg-navy-800"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className={`relative flex items-center gap-2 ${isActive ? "text-white" : ""}`}>
                  {t.icon}
                  {t.label}
                  {count > 0 && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                      isActive ? "bg-white/20 text-white" : "bg-navy-50 text-navy-600"
                    }`}>
                      {count}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TypeTabs;
