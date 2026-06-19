// @ts-nocheck
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ShieldCheck, ShieldX, Clock, Download, FileText, ExternalLink } from "lucide-react";
import Navbar from "components/home/Navbar";
import Footer from "components/home/Footer";
import useVerifyCertificate from "hooks/certificates/useVerifyCertificate";

/* ─── Result card ────────────────────────────────────────────────────────── */
const ResultRow = ({ label, value }) => {
  if (!value) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-3 border-b border-slate-100 last:border-0">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest sm:w-40 flex-shrink-0">{label}</p>
      <p className="text-sm text-navy-800 font-medium">{value}</p>
    </div>
  );
};

/* ─── Page ───────────────────────────────────────────────────────────────── */
const VerifyCertificatePage = () => {
  const { verify, result, loading, error, reset } = useVerifyCertificate();

  const [verificationCode, setVerificationCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode.trim()) return;
    verify({ verification_code: verificationCode.trim() });
  };

  const handleReset = () => {
    reset();
    setVerificationCode("");
  };

  const isValid   = result?.is_valid === "true" || result?.status === "issued";
  const isRevoked = result?.status === "revoked";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Hero */}
      <section className="w-full bg-navy-800 pt-[100px] sm:pt-[120px] lg:pt-[150px] pb-14 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/60 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-gold-500 opacity-[0.06] rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl mx-auto px-6 text-center relative">
          <span className="inline-block bg-gold-500/10 border border-gold-500/25 text-gold-400 text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
            Certificate Verification
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4">
            Verify Certificate
          </h1>
          <p className="text-navy-300 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            Enter the verification code found on your certificate to confirm its authenticity.
          </p>
        </div>
      </section>

      <main className="flex-1 pb-16 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto pt-12">

          {/* Form card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 mb-6"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-navy-800 mb-1.5">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="e.g. IKA-2026-XXXX"
                  className="w-full rounded-md lg:rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-navy-800 outline-none focus:ring-2 focus:ring-navy-300 transition"
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                  <ShieldX size={16} className="flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex gap-2 pt-1">
                {result && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex-1 rounded-md lg:rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading || !verificationCode.trim()}
                  className="flex-1 rounded-md lg:rounded-lg bg-navy-800 hover:bg-navy-700 text-white text-sm font-semibold py-2.5 disabled:opacity-60 transition flex items-center justify-center gap-2"
                >
                  <Search size={15} />
                  {loading ? "Verifying..." : "Verify Certificate"}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Result */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
            >
              {/* Validity banner */}
              <div className={`px-6 py-4 flex items-center gap-3 ${
                isRevoked ? "bg-red-50 border-b border-red-100" :
                isValid   ? "bg-green-50 border-b border-green-100" :
                            "bg-amber-50 border-b border-amber-100"
              }`}>
                {isRevoked ? (
                  <ShieldX size={22} className="text-red-500 flex-shrink-0" />
                ) : isValid ? (
                  <ShieldCheck size={22} className="text-green-600 flex-shrink-0" />
                ) : (
                  <Clock size={22} className="text-amber-600 flex-shrink-0" />
                )}
                <div>
                  <p className={`font-bold text-sm ${
                    isRevoked ? "text-red-700" : isValid ? "text-green-700" : "text-amber-700"
                  }`}>
                    {isRevoked ? "Certificate Revoked" : isValid ? "Certificate Verified" : "Certificate Pending"}
                  </p>
                  <p className={`text-xs mt-0.5 ${
                    isRevoked ? "text-red-500" : isValid ? "text-green-600" : "text-amber-600"
                  }`}>
                    {isRevoked
                      ? "This certificate has been revoked and is no longer valid."
                      : isValid
                      ? "This certificate is authentic and was issued by IKA."
                      : "This certificate is awaiting finalization."}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="px-6 py-2">
                <ResultRow label="Certificate #"     value={result.certificate_number} />
                <ResultRow label="Verification Code" value={result.verification_code} />
                <ResultRow label="Participant"       value={result.participant_name} />
                <ResultRow label="Program"           value={result.program_name} />
                <ResultRow label="Certificate Type"  value={result.certificate_type ? result.certificate_type.charAt(0).toUpperCase() + result.certificate_type.slice(1) : undefined} />
                <ResultRow label="Issue Date"        value={result.issue_date ? new Date(result.issue_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : undefined} />
                <ResultRow label="Lead Trainer"      value={result.lead_trainer_name} />
                <ResultRow label="Issued By"         value={result.issued_by} />
              </div>

              {/* PDF file row */}
              {typeof result.certificate_pdf === "string" && result.certificate_pdf && (
                <div className="px-6 pb-5">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-md lg:rounded-lg border border-slate-200 bg-slate-50">
                    <FileText size={18} className="text-navy-500 flex-shrink-0" />
                    <span className="text-sm text-navy-800 truncate flex-1">
                      {result.certificate_pdf.split("/").pop()}
                    </span>
                    <a
                      href={result.certificate_pdf}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-400 hover:text-navy-600 transition flex-shrink-0"
                      title="View"
                    >
                      <ExternalLink size={14} />
                    </a>
                    <button
                      type="button"
                      title="Download"
                      className="text-slate-400 hover:text-navy-600 transition flex-shrink-0"
                      onClick={() => {
                        const a = document.createElement("a");
                        a.href = result.certificate_pdf;
                        a.download = `IKA-Certificate-${result.certificate_number ?? result.participant_name?.replace(/\s+/g, "-")}.pdf`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                      }}
                    >
                      <Download size={14} />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VerifyCertificatePage;
