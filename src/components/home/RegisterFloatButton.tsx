// @ts-nocheck
import { useState } from "react";
import { Link } from "react-router-dom";
import { MdClose } from "react-icons/md";
import { ClipboardList } from "lucide-react";

const RegisterFloatButton = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="fixed bottom-24 right-6 z-50 flex flex-col items-end gap-2"
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Tooltip bubble */}
      {showTooltip && (
        <div className="flex items-start gap-2 rounded-2xl bg-white p-3.5 pr-4 shadow-xl ring-1 ring-slate-200 animate-in fade-in slide-in-from-bottom-2 duration-200 max-w-[240px]">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-500 text-white">
            <ClipboardList size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-900">Register for the Club</p>
            <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
              Secure your place — seats are limited
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowTooltip(false)}
            className="ml-1 shrink-0 text-slate-300 transition-colors hover:text-slate-500"
            aria-label="Dismiss"
          >
            <MdClose className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Float button */}
      <Link
        to="/register/club"
        onMouseEnter={() => setShowTooltip(true)}
        aria-label="Register for the Club"
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gold-500 text-white shadow-lg shadow-gold-500/40 transition-all duration-200 ease-in-out hover:-translate-y-1 hover:bg-gold-400 hover:shadow-xl hover:shadow-gold-500/50 active:scale-95"
      >
        <ClipboardList size={26} />
        <span
          aria-hidden="true"
          className="absolute h-14 w-14 animate-ping rounded-full bg-gold-400 opacity-30"
        />
      </Link>
    </div>
  );
};

export default RegisterFloatButton;
