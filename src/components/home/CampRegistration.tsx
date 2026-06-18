// @ts-nocheck
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tent, User, Shield, Check, Loader2, ChevronRight, ChevronLeft } from "lucide-react";
import useCreateCampRegistration from "hooks/campRegistrations/useCreateCampRegistration";
import type { CampRegistrationType, CampNationality, GuardianRelationship } from "types/campRegistration";

/* ── Constants ── */
const NATIONALITIES: { value: CampNationality; label: string }[] = [
  { value: "SA", label: "Saudi Arabia" },
  { value: "KW", label: "Kuwait" },
  { value: "QA", label: "Qatar" },
  { value: "OM", label: "Oman" },
];

const RELATIONSHIPS: { value: GuardianRelationship; label: string }[] = [
  { value: "father",   label: "Father"   },
  { value: "mother",   label: "Mother"   },
  { value: "guardian", label: "Guardian" },
  { value: "other",    label: "Other"    },
];

const STEPS = [
  { number: 1, label: "Participant"  },
  { number: 2, label: "Details"      },
];

/* ── Shared input ── */
const Field = ({ label, required = false, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-navy-700 uppercase tracking-wide">
      {label}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const inputCls =
  "w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-100 transition text-navy-800 placeholder-slate-400 bg-white";

const selectCls =
  "w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-100 transition text-navy-800 bg-white";

/* ── Step indicator ── */
const StepIndicator = ({ current }: { current: number }) => (
  <div className="flex items-center justify-center mb-8">
    {STEPS.map((step, i) => {
      const done   = current > step.number;
      const active = current === step.number;
      return (
        <div key={step.number} className="flex items-center">
          <div className="flex flex-col items-center gap-1.5">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
              done   ? "bg-gold-500 border-gold-500 text-white" :
              active ? "bg-navy-700 border-navy-700 text-white" :
                       "bg-white border-slate-200 text-slate-400"
            }`}>
              {done ? <Check size={16} /> : step.number}
            </div>
            <span className={`text-[11px] font-semibold whitespace-nowrap ${
              active ? "text-navy-700" : done ? "text-gold-500" : "text-slate-400"
            }`}>{step.label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`w-16 sm:w-28 h-0.5 mb-5 mx-2 rounded-full transition-all duration-500 ${
              current > step.number ? "bg-gold-400" : "bg-slate-200"
            }`} />
          )}
        </div>
      );
    })}
  </div>
);

const CampRegistration = () => {
  const { createCampRegistration, loading, error } = useCreateCampRegistration();

  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [regType, setRegType] = useState<CampRegistrationType>("self");

  const [participant, setParticipant] = useState({
    first_name:  "",
    last_name:   "",
    dob:         "",
    nationality: "" as CampNationality | "",
    passport_no: "",
    whatsapp:    "",
    email:       "",
  });

  const [guardian, setGuardian] = useState({
    full_name:    "",
    relationship: "" as GuardianRelationship | "",
    whatsapp:     "",
    email:        "",
  });

  const [healthNotes,    setHealthNotes]    = useState("");
  const [referralSource, setReferralSource] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateP = (k: string, v: string) => setParticipant((p) => ({ ...p, [k]: v }));
  const updateG = (k: string, v: string) => setGuardian((g)  => ({ ...g, [k]: v }));

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!participant.first_name.trim()) e.first_name  = "Required";
    if (!participant.last_name.trim())  e.last_name   = "Required";
    if (!participant.dob)               e.dob         = "Required";
    if (!participant.nationality)       e.nationality = "Required";
    if (!participant.passport_no.trim()) e.passport_no = "Required";
    if (!participant.whatsapp.trim())   e.whatsapp    = "Required";
    if (!participant.email.trim())      e.email       = "Required";
    else if (!/\S+@\S+\.\S+/.test(participant.email)) e.email = "Invalid email";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    if (regType !== "child") return true;
    const e: Record<string, string> = {};
    if (!guardian.full_name.trim())    e.g_full_name    = "Required";
    if (!guardian.relationship)        e.g_relationship = "Required";
    if (!guardian.whatsapp.trim())     e.g_whatsapp     = "Required";
    if (!guardian.email.trim())        e.g_email        = "Required";
    else if (!/\S+@\S+\.\S+/.test(guardian.email)) e.g_email = "Invalid email";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
  };

  const handleBack = () => { setStep(1); setErrors({}); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    const result = await createCampRegistration({
      participant: { ...participant, nationality: participant.nationality as CampNationality },
      ...(regType === "child" && { guardian: { ...guardian, relationship: guardian.relationship as GuardianRelationship } }),
      registration_type: regType,
      source: "website",
      ...(healthNotes.trim()    && { health_notes:    healthNotes.trim() }),
      ...(referralSource.trim() && { referral_source: referralSource.trim() }),
    });

    if (result) setSubmitted(true);
  };

  const err = (k: string) => errors[k] ? (
    <p className="text-xs text-red-500 mt-0.5">{errors[k]}</p>
  ) : null;

  /* ── Success ── */
  if (submitted) {
    return (
      <section className="bg-navy-900 py-20">
        <div className="max-w-lg mx-auto px-6 text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }}>
            <div className="w-20 h-20 rounded-full bg-gold-500/20 border border-gold-400/40 flex items-center justify-center mx-auto mb-6">
              <Check size={36} className="text-gold-400" />
            </div>
            <h2 className="text-2xl font-extrabold text-white mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Registration Submitted!
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-8">
              Thank you for registering. Our team will review your application and reach out to you shortly via WhatsApp or email.
            </p>
            <button
              type="button"
              onClick={() => { setSubmitted(false); setStep(1); setParticipant({ first_name: "", last_name: "", dob: "", nationality: "", passport_no: "", whatsapp: "", email: "" }); setGuardian({ full_name: "", relationship: "", whatsapp: "", email: "" }); setHealthNotes(""); setReferralSource(""); }}
              className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-white font-semibold px-6 py-3 rounded-md lg:rounded-lg transition text-sm"
            >
              Register Another
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-navy-900 py-20 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden>
        <span className="absolute -top-12 -right-12 text-[20vw] font-extrabold text-navy-800 leading-none opacity-30">
          IKA
        </span>
      </div>

      <div className="relative max-w-2xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 bg-gold-500/10 border border-gold-500/30 text-gold-400 text-[11px] font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-5">
            <Tent size={12} /> Camp Registration
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Register for the Camp
          </h2>
          <p className="text-slate-400 text-sm mt-3 max-w-md mx-auto">
            Fill in the details below and our team will follow up with you within 24 hours.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-navy-700 via-navy-500 to-gold-400" />
          <div className="p-6 sm:p-8">

            <StepIndicator current={step} />

            {/* Registration type toggle */}
            <div className="flex rounded-xl border border-slate-200 overflow-hidden mb-6">
              {(["self", "child"] as CampRegistrationType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setRegType(t)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition-all ${
                    regType === t
                      ? "bg-navy-700 text-white"
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {t === "self" ? <User size={15} /> : <Shield size={15} />}
                  {t === "self" ? "Self" : "Child / Minor"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">

                {/* Step 1 — Participant */}
                {step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.2 }}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <Field label="First Name" required>
                        <input className={inputCls} placeholder="Ahmad" value={participant.first_name} onChange={(e) => updateP("first_name", e.target.value)} />
                        {err("first_name")}
                      </Field>
                      <Field label="Last Name" required>
                        <input className={inputCls} placeholder="Al-Rashid" value={participant.last_name} onChange={(e) => updateP("last_name", e.target.value)} />
                        {err("last_name")}
                      </Field>
                      <Field label="Date of Birth" required>
                        <input type="date" className={inputCls} value={participant.dob} onChange={(e) => updateP("dob", e.target.value)} />
                        {err("dob")}
                      </Field>
                      <Field label="Nationality" required>
                        <select className={selectCls} value={participant.nationality} onChange={(e) => updateP("nationality", e.target.value)}>
                          <option value="">Select nationality</option>
                          {NATIONALITIES.map((n) => <option key={n.value} value={n.value}>{n.label}</option>)}
                        </select>
                        {err("nationality")}
                      </Field>
                      <Field label="Passport Number" required>
                        <input className={inputCls} placeholder="A12345678" value={participant.passport_no} onChange={(e) => updateP("passport_no", e.target.value)} />
                        {err("passport_no")}
                      </Field>
                      <Field label="WhatsApp" required>
                        <input className={inputCls} placeholder="+966 50 000 0000" value={participant.whatsapp} onChange={(e) => updateP("whatsapp", e.target.value)} />
                        {err("whatsapp")}
                      </Field>
                      <Field label="Email" required>
                        <input type="email" className={inputCls} placeholder="you@email.com" value={participant.email} onChange={(e) => updateP("email", e.target.value)} />
                        {err("email")}
                      </Field>
                    </div>

                    <button
                      type="button"
                      onClick={handleNext}
                      className="w-full flex items-center justify-center gap-2 bg-navy-700 hover:bg-navy-800 text-white font-semibold py-3 rounded-md lg:rounded-lg transition text-sm mt-2"
                    >
                      Next <ChevronRight size={16} />
                    </button>
                  </motion.div>
                )}

                {/* Step 2 — Guardian + extras */}
                {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.2 }}>

                    {regType === "child" && (
                      <div className="mb-5">
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                          <Shield size={12} /> Guardian Information
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Field label="Guardian Full Name" required>
                            <input className={inputCls} placeholder="Full name" value={guardian.full_name} onChange={(e) => updateG("full_name", e.target.value)} />
                            {err("g_full_name")}
                          </Field>
                          <Field label="Relationship" required>
                            <select className={selectCls} value={guardian.relationship} onChange={(e) => updateG("relationship", e.target.value)}>
                              <option value="">Select relationship</option>
                              {RELATIONSHIPS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                            </select>
                            {err("g_relationship")}
                          </Field>
                          <Field label="Guardian WhatsApp" required>
                            <input className={inputCls} placeholder="+966 50 000 0000" value={guardian.whatsapp} onChange={(e) => updateG("whatsapp", e.target.value)} />
                            {err("g_whatsapp")}
                          </Field>
                          <Field label="Guardian Email" required>
                            <input type="email" className={inputCls} placeholder="guardian@email.com" value={guardian.email} onChange={(e) => updateG("email", e.target.value)} />
                            {err("g_email")}
                          </Field>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-4 mb-4">
                      <Field label="Health Notes / Allergies">
                        <textarea
                          rows={3}
                          className={inputCls + " resize-none"}
                          placeholder="Any health conditions, allergies, or special needs we should know about..."
                          value={healthNotes}
                          onChange={(e) => setHealthNotes(e.target.value)}
                        />
                      </Field>
                      <Field label="How did you hear about us?">
                        <input className={inputCls} placeholder="Friend, social media, school..." value={referralSource} onChange={(e) => setReferralSource(e.target.value)} />
                      </Field>
                    </div>

                    {error && (
                      <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5 mb-4">
                        {error}
                      </p>
                    )}

                    <div className="flex gap-3">
                      <button type="button" onClick={handleBack}
                        className="flex items-center gap-1.5 px-5 py-3 border border-slate-200 text-slate-600 hover:border-slate-300 font-semibold rounded-md lg:rounded-lg text-sm transition">
                        <ChevronLeft size={16} /> Back
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 disabled:opacity-60 text-white font-semibold py-3 rounded-md lg:rounded-lg transition text-sm"
                      >
                        {loading ? <><Loader2 size={16} className="animate-spin" /> Submitting...</> : "Submit Registration"}
                      </button>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CampRegistration;
