// @ts-nocheck
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Shield, Check, Loader2, ChevronRight, ChevronLeft } from "lucide-react";
import Navbar from "components/home/Navbar";
import Footer from "components/home/Footer";
import useCreateCampRegistration from "hooks/campRegistrations/useCreateCampRegistration";
import useCamps from "hooks/camps/useCamps";
import type { CampRegistrationType, CampNationality, GuardianRelationship } from "types/campRegistration";
import { ARAB_COUNTRIES, HEAR_ABOUT_US_OPTIONS } from "constants/lists";

const NATIONALITIES = ARAB_COUNTRIES.map((c) => ({ value: c.code, label: c.name }));

const RELATIONSHIPS = [
  { value: "father",   label: "Father"   },
  { value: "mother",   label: "Mother"   },
  { value: "guardian", label: "Guardian" },
  { value: "other",    label: "Other"    },
];

const STEPS = [
  { number: 1, label: "Participant" },
  { number: 2, label: "Details"    },
];

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

const StepIndicator = ({ current }) => (
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

const RegisterCampPage = () => {
  const { createCampRegistration, loading, error, fieldErrors } = useCreateCampRegistration();
  const { camps: allCamps } = useCamps();
  const openCamps = useMemo(
    () => allCamps.filter((c) => c.status === "open"),
    [allCamps]
  );

  const [step, setStep]           = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [regType, setRegType]     = useState<CampRegistrationType>("self");

  const [selectedCampUid,  setSelectedCampUid]  = useState("");
  const [participant, setParticipant] = useState({
    first_name:  "", last_name: "", dob: "",
    nationality: "" as CampNationality | "",
    passport_no: "", whatsapp: "", email: "",
  });

  const [guardian, setGuardian] = useState({
    full_name: "", relationship: "" as GuardianRelationship | "",
    whatsapp: "", email: "",
  });

  const [healthNotes,    setHealthNotes]    = useState("");
  const [howDidYouHear,  setHowDidYouHear]  = useState("");
  const [referralSource, setReferralSource] = useState("");
  const [referredByCode, setReferredByCode] = useState("");
  const [errors, setErrors]                 = useState<Record<string, string>>({});

  const updateP = (k: string, v: string) => setParticipant((p) => ({ ...p, [k]: v }));
  const updateG = (k: string, v: string) => setGuardian((g)  => ({ ...g, [k]: v }));

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!selectedCampUid)                 e.selectedCampUid = "Please select a club";
    if (!participant.first_name.trim())   e.first_name  = "Required";
    if (!participant.last_name.trim())    e.last_name   = "Required";
    if (!participant.dob)                 e.dob         = "Required";
    if (!participant.nationality)         e.nationality = "Required";
    if (!participant.passport_no.trim())  e.passport_no = "Required";
    if (!participant.whatsapp.trim())     e.whatsapp    = "Required";
    if (!participant.email.trim())        e.email       = "Required";
    else if (!/\S+@\S+\.\S+/.test(participant.email)) e.email = "Invalid email";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    if (regType !== "child") return true;
    const e: Record<string, string> = {};
    if (!guardian.full_name.trim())  e.g_full_name    = "Required";
    if (!guardian.relationship)      e.g_relationship = "Required";
    if (!guardian.whatsapp.trim())   e.g_whatsapp     = "Required";
    if (!guardian.email.trim())      e.g_email        = "Required";
    else if (!/\S+@\S+\.\S+/.test(guardian.email)) e.g_email = "Invalid email";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => { if (step === 1 && validateStep1()) setStep(2); };
  const handleBack = () => { setStep(1); setErrors({}); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    const selectedCamp = openCamps.find((c) => c.uid === selectedCampUid);

    const result = await createCampRegistration({
      camp:              selectedCampUid,
      participant:       { ...participant, nationality: participant.nationality as CampNationality },
      ...(regType === "child" && { guardian: { ...guardian, relationship: guardian.relationship as GuardianRelationship } }),
      registration_type: regType,
      source:            "website",
      ...(selectedCamp?.min_age != null && { min_age: selectedCamp.min_age }),
      ...(selectedCamp?.max_age != null && { max_age: selectedCamp.max_age }),
      ...(healthNotes.trim()    && { health_notes:              healthNotes.trim() }),
      ...(howDidYouHear.trim()  && { how_did_you_hear_about_us: howDidYouHear.trim() }),
      ...(referralSource.trim() && { referral_source:           referralSource.trim() }),
      ...(referredByCode.trim() && { referred_by_code:          referredByCode.trim() }),
    });
    if (result) setSubmitted(true);
  };

  const reset = () => {
    setSubmitted(false); setStep(1); setErrors({});
    setSelectedCampUid("");
    setParticipant({ first_name: "", last_name: "", dob: "", nationality: "", passport_no: "", whatsapp: "", email: "" });
    setGuardian({ full_name: "", relationship: "", whatsapp: "", email: "" });
    setHealthNotes(""); setHowDidYouHear(""); setReferralSource(""); setReferredByCode("");
  };

  const err = (k: string) =>
    errors[k] ? <p className="text-xs text-red-500 mt-0.5">{errors[k]}</p> : null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="w-full bg-navy-800 pt-[100px] sm:pt-[120px] lg:pt-[150px] pb-14 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/60 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-gold-500 opacity-[0.06] rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl mx-auto px-6 text-center relative">
          <span className="inline-block bg-gold-500/10 border border-gold-500/25 text-gold-400 text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
            Club Registration
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4">
            Register for the Club
          </h1>
          <p className="text-navy-300 text-sm sm:text-base max-w-md mx-auto leading-relaxed mb-10">
            Fill in the details below and our team will follow up within 24 hours.
          </p>
          <div className="inline-flex items-center gap-2 sm:gap-3 text-[11px] font-semibold uppercase tracking-widest text-navy-400">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-gold-400" />Participant</span>
            <span className="text-navy-600">›</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-navy-500" />Details</span>
            <span className="text-navy-600">›</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-navy-500" />Submit</span>
          </div>
        </div>
      </section>

      <main className="flex-1 pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-12">

          {submitted ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-green-50 border border-green-100 flex items-center justify-center mx-auto mb-6">
                <Check size={36} className="text-green-500" />
              </div>
              <h2 className="text-2xl font-extrabold text-navy-800 mb-3"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Registration Submitted!
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
                Thank you for registering. Our team will review your application and reach out via WhatsApp or email.
              </p>
              <button type="button" onClick={reset}
                className="inline-flex items-center gap-2 bg-navy-700 hover:bg-navy-800 text-white font-semibold px-6 py-3 rounded-md lg:rounded-lg transition text-sm">
                Register Another
              </button>
            </motion.div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-navy-700 via-navy-500 to-gold-400" />
              <div className="p-6 sm:p-8">

                <StepIndicator current={step} />

                {/* Type toggle */}
                <div className="flex rounded-xl border border-slate-200 overflow-hidden mb-6">
                  {(["self", "child"] as CampRegistrationType[]).map((t) => (
                    <button key={t} type="button" onClick={() => setRegType(t)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition-all ${
                        regType === t ? "bg-navy-700 text-white" : "text-slate-500 hover:bg-slate-50"
                      }`}>
                      {t === "self" ? <User size={15} /> : <Shield size={15} />}
                      {t === "self" ? "Self" : "Child / Minor"}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit}>
                  <AnimatePresence mode="wait">

                    {step === 1 && (
                      <motion.div key="s1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.2 }}>
                        <div className="grid grid-cols-1 gap-4 mb-6">
                          {/* Club selector */}
                          <Field label="Select Club" required>
                            <select
                              className={selectCls}
                              value={selectedCampUid}
                              onChange={(e) => setSelectedCampUid(e.target.value)}
                            >
                              <option value="">Select a club to register for...</option>
                              {openCamps.map((c) => (
                                <option key={c.uid} value={c.uid}>{c.name}</option>
                              ))}
                            </select>
                            {err("selectedCampUid")}
                          </Field>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
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
                        <button type="button" onClick={handleNext}
                          className="w-full flex items-center justify-center gap-2 bg-navy-700 hover:bg-navy-800 text-white font-semibold py-3 rounded-md lg:rounded-lg transition text-sm">
                          Next <ChevronRight size={16} />
                        </button>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div key="s2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.2 }}>
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

                        <div className="grid grid-cols-1 gap-4 mb-6">
                          <Field label="Health Notes / Allergies">
                            <textarea rows={3} className={inputCls + " resize-none"}
                              placeholder="Any health conditions, allergies, or special needs..."
                              value={healthNotes} onChange={(e) => setHealthNotes(e.target.value)} />
                          </Field>
                          <Field label="How did you hear about us?">
                            <select className={selectCls} value={howDidYouHear} onChange={(e) => setHowDidYouHear(e.target.value)}>
                              <option value="">Select an option</option>
                              {HEAR_ABOUT_US_OPTIONS.map((o) => (
                                <option key={o.code} value={o.code}>{o.name}</option>
                              ))}
                            </select>
                          </Field>
                          <Field label="Referral Source">
                            <input className={inputCls} placeholder="e.g. Instagram, friend, event..."
                              value={referralSource} onChange={(e) => setReferralSource(e.target.value)} />
                          </Field>
                          <Field label="Referral Code">
                            <input className={inputCls} placeholder="Enter influencer or referral code (optional)"
                              value={referredByCode} onChange={(e) => setReferredByCode(e.target.value.toUpperCase())} />
                          </Field>
                        </div>

                        {(error || fieldErrors) && (
                          <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3 mb-4 space-y-1">
                            {error && <p>{error}</p>}
                            {fieldErrors && Object.entries(fieldErrors).map(([field, messages]) =>
                              (messages as string[]).map((msg, i) => (
                                <p key={`${field}-${i}`}>
                                  <span className="font-semibold capitalize">{field.replace(/_/g, " ")}:</span>{" "}{msg}
                                </p>
                              ))
                            )}
                          </div>
                        )}

                        <div className="flex gap-3">
                          <button type="button" onClick={handleBack}
                            className="flex items-center gap-1.5 px-5 py-3 border border-slate-200 text-slate-600 hover:border-slate-300 font-semibold rounded-md lg:rounded-lg text-sm transition">
                            <ChevronLeft size={16} /> Back
                          </button>
                          <button type="submit" disabled={loading}
                            className="flex-1 flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 disabled:opacity-60 text-white font-semibold py-3 rounded-md lg:rounded-lg transition text-sm">
                            {loading
                              ? <><Loader2 size={16} className="animate-spin" /> Submitting...</>
                              : "Submit Registration"}
                          </button>
                        </div>
                      </motion.div>
                    )}

                  </AnimatePresence>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RegisterCampPage;
