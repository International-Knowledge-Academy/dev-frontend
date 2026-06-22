// @ts-nocheck
import { useState } from "react";
import { X, Mail, Phone, Download, Loader2 } from "lucide-react";

interface Props {
  open:      boolean;
  onSubmit:  (email: string, phone: string) => void;
  onSkip:    () => void;
  loading:   boolean;
}

const LeadCaptureModal = ({ open, onSubmit, onSkip, loading }: Props) => {
  const [email, setEmail]         = useState("");
  const [phone, setPhone]         = useState("");
  const [emailError, setEmailError] = useState("");

  if (!open) return null;

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValidEmail) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    onSubmit(email.trim(), phone.trim());
  };

  const handleSkip = () => {
    setEmail("");
    setPhone("");
    setEmailError("");
    onSkip();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-navy-900/60 backdrop-blur-sm"
        onClick={handleSkip}
      />

      {/* Card */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Gold accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400" />

        {/* Close */}
        <button
          type="button"
          onClick={handleSkip}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >
          <X size={16} />
        </button>

        <div className="px-7 pt-7 pb-6">
          {/* Header */}
          <div className="mb-6">
            <div className="w-11 h-11 rounded-xl bg-gold-50 border border-gold-200 flex items-center justify-center mb-4">
              <Download size={20} className="text-gold-500" />
            </div>
            <h2 className="text-lg font-extrabold text-navy-800 leading-snug">
              One step before your download
            </h2>
            <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
              Stay updated on new programs and events. You can skip anytime.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Email address <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                  placeholder="you@example.com"
                  className={`w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border bg-white text-navy-800 placeholder-slate-400 outline-none transition
                    ${emailError
                      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                      : "border-slate-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-100"
                    }`}
                />
              </div>
              {emailError && (
                <p className="text-xs text-red-500 mt-1">{emailError}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Phone / WhatsApp
                <span className="ml-1.5 text-[10px] font-normal text-slate-400">(optional)</span>
              </label>
              <div className="relative">
                <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+60 12 345 6789"
                  className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-slate-200 bg-white text-navy-800 placeholder-slate-400 outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-100 transition"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold py-2.5 rounded-md lg:rounded-lg text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
            >
              {loading ? (
                <><Loader2 size={15} className="animate-spin" /> Submitting…</>
              ) : (
                <><Download size={15} /> Submit &amp; Download</>
              )}
            </button>
          </form>

          {/* Privacy note */}
          <p className="text-[10px] text-slate-300 text-center mt-3 leading-relaxed">
            We respect your privacy. No spam, unsubscribe anytime.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LeadCaptureModal;
