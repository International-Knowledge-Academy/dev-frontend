// @ts-nocheck
import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { MdClose } from "react-icons/md";

interface WhatsAppFloatButtonProps {
  phone?: string;
  message?: string;
}

const WhatsAppFloatButton = ({
  phone = "601139936766",
  message = "Hi IKA, I'd like to know more about your programs!",
}: WhatsAppFloatButtonProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2"
      onMouseLeave={() => setShowTooltip(false)}
    >

      {/* Tooltip bubble */}
      {showTooltip && (
        <div className="flex items-start gap-2 rounded-2xl bg-white p-3.5 pr-4 shadow-xl ring-1 ring-slate-200 animate-in fade-in slide-in-from-bottom-2 duration-200 max-w-[240px]">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-700 text-white">
            <FaWhatsapp size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-900">Chat with IKA</p>
            <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
              Typically replies within an hour
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
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        aria-label="Chat with us on WhatsApp"
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-navy-700 text-white shadow-lg shadow-navy-700/40 transition-all duration-200 ease-in-out hover:-translate-y-1 hover:bg-navy-800 hover:shadow-xl hover:shadow-navy-700/50 active:scale-95"
      >
        <FaWhatsapp size={26} />
        <span
          aria-hidden="true"
          className="absolute h-14 w-14 animate-ping rounded-full bg-gold-400 opacity-30"
        />
      </a>
    </div>
  );
};

export default WhatsAppFloatButton;
