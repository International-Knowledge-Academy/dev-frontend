// @ts-nocheck
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MdSend } from "react-icons/md";
import { Check } from "lucide-react";
import { useToast } from "context/ToastContext";
import Navbar from "components/home/Navbar";
import Footer from "components/home/Footer";
import { InputField } from "components/form";
import SearchableSelect from "components/form/SearchableSelect";
import useGetProgram from "hooks/programs/useGetProgram";
import useAllCategories from "hooks/categories/useAllCategories";
import useFields from "hooks/fields/useFields";
import usePrograms from "hooks/programs/usePrograms";
import useCreateRegistration from "hooks/registrations/useCreateRegistration";

const TYPE_OPTIONS = [
  { value: "personal",  label: "Personal"  },
  { value: "corporate", label: "Corporate" },
];

const STEPS = [
  { number: 1, label: "Select Program" },
  { number: 2, label: "Your Details"   },
  { number: 3, label: "Review"         },
];

const initialForm = {
  category:          "",
  field:             "",
  program:           "",
  registration_type: "personal",
  full_name:         "",
  email:             "",
  phone:             "",
  job_title:         "",
  address:           "",
};

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
            <span className={`text-[11px] font-semibold whitespace-nowrap transition-colors duration-300 ${
              active ? "text-navy-700" : done ? "text-gold-500" : "text-slate-400"
            }`}>
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`w-10 sm:w-24 h-0.5 mb-5 mx-2 rounded-full transition-all duration-500 ${
              current > step.number ? "bg-gold-400" : "bg-slate-200"
            }`} />
          )}
        </div>
      );
    })}
  </div>
);

/* ── Slide variants ── */
const variants = {
  enter:  (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
  center: { opacity: 1, x: 0 },
  exit:   (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
};

/* ── Summary row ── */
const SummaryRow = ({ label, value }) => (
  <div className="flex items-center justify-between text-sm py-2 border-b border-slate-100 last:border-0">
    <span className="text-slate-400">{label}</span>
    <span className="text-navy-800 font-medium text-right max-w-[60%] truncate">{value || "—"}</span>
  </div>
);

/* ── Page ── */
const RegisterPage = () => {
  const navigate       = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToast }   = useToast();
  const preselectedUid = searchParams.get("uid") ?? undefined;

  const { program: preProgram } = useGetProgram(preselectedUid);

  const [step, setStep] = useState(1);
  const [dir,  setDir]  = useState(1);

  const [selectedCategoryUid, setSelectedCategoryUid] = useState("");
  const [selectedFieldUid,    setSelectedFieldUid]    = useState("");

  const { categories, loading: loadingCats }                    = useAllCategories();
  const { fields,    loading: loadingFields,   setParams: setFieldsParams   } = useFields({});
  const { programs,  loading: loadingPrograms, setParams: setProgramsParams  } = usePrograms({ is_active: true });

  const { createRegistration, loading, error, fieldErrors } = useCreateRegistration();

  const [formData, setFormData] = useState(initialForm);
  const [errors,   setErrors]   = useState<Record<string, string>>({});

  const update = (field: string, value: string) => {
    setFormData((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
  };

  useEffect(() => {
    if (preProgram) {
      setFormData((p) => ({ ...p, program: preProgram.uid ?? "" }));
      if (preProgram.field?.uid) {
        setSelectedFieldUid(preProgram.field.uid);
        setFormData((p) => ({ ...p, field: preProgram.field.uid }));
      }
    }
  }, [preProgram]);

  const handleCategoryChange = (key: string, val: string) => {
    update(key, val);
    setSelectedCategoryUid(val);
    setFieldsParams({ category: val || undefined, is_active: true });
    setFormData((p) => ({ ...p, field: "", program: "" }));
    setSelectedFieldUid("");
    setProgramsParams({ field: undefined, is_active: true });
  };

  const handleFieldChange = (key: string, val: string) => {
    update(key, val);
    setSelectedFieldUid(val);
    setProgramsParams({ field: val || undefined, is_active: true });
    setFormData((p) => ({ ...p, program: "" }));
  };

  const validateStep = (s: number) => {
    const e: Record<string, string> = {};
    if (s === 1) {
      if (!formData.category) e.category = "Please select a category";
      if (!formData.field)    e.field    = "Please select a field";
      if (!formData.program)  e.program  = "Please select a program";
    }
    if (s === 2) {
      if (!formData.full_name.trim()) e.full_name = "Full name is required";
      if (!formData.email.trim())     e.email     = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = "Invalid email";
      if (!formData.phone.trim())     e.phone     = "Phone is required";
    }
    return e;
  };

  const goNext = () => {
    const errs = validateStep(step);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setDir(1);
    setStep((s) => s + 1);
  };

  const goBack = () => {
    setDir(-1);
    setStep((s) => s - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const created = await createRegistration({
      program_uid:       formData.program,
      category_uid:      formData.category  || undefined,
      field_uid:         formData.field     || undefined,
      registration_type: formData.registration_type,
      full_name:         formData.full_name,
      email:             formData.email,
      phone:             formData.phone,
      job_title:         formData.job_title  || undefined,
      address:           formData.address    || undefined,
    });
    if (created) {
      addToast("Registration submitted successfully! We'll be in touch shortly.", "success");
      navigate("/register/success");
    }
  };

  /* Labels for review step */
  const selectedProgram  = programs.find((p) => p.uid === formData.program) ?? preProgram;
  const selectedField    = fields.find((f) => f.uid === formData.field);
  const selectedCategory = categories.find((c) => c.uid === formData.category);

  const displayErrors = { ...errors, ...fieldErrors };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="bg-navy-800 mt-[80px] sm:mt-[100px] lg:mt-[120px] pt-16 pb-12 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.8) 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500 opacity-[0.06] rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="max-w-3xl mx-auto px-6 relative text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Register for a Program
          </h1>
          <p className="text-navy-300 text-base max-w-xl mx-auto">
            Select a program, fill in your details, and we'll confirm your enrollment within 24 hours.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto w-full px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden"
        >
          {/* Card header */}
          <div className="bg-navy-600 px-8 py-7 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gold-500 opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            <h3 className="text-white font-extrabold text-xl relative">Program Registration</h3>
            <p className="text-navy-200 text-sm mt-1 relative">
              Fill in the details below and we'll confirm your enrollment within 24 hours.
            </p>
          </div>

          <div className="px-8 py-8">
            <StepIndicator current={step} />

            {error && (
              <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="overflow-hidden">
                <AnimatePresence mode="wait" custom={dir}>
                  <motion.div
                    key={step}
                    custom={dir}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >

                    {/* ── Step 1: Select Program ── */}
                    {step === 1 && (
                      <div>
                        <SearchableSelect
                          label="Category"
                          field="category"
                          required
                          placeholder="Search categories…"
                          loading={loadingCats}
                          options={categories.map((c) => ({ value: c.uid, label: c.name }))}
                          formData={formData} errors={displayErrors} updateFormData={handleCategoryChange}
                        />
                        <SearchableSelect
                          label="Field"
                          field="field"
                          required
                          placeholder={selectedCategoryUid ? "Search fields…" : "Select a category first"}
                          loading={loadingFields && !!selectedCategoryUid}
                          disabled={!selectedCategoryUid}
                          options={fields.map((f) => ({ value: f.uid, label: f.name }))}
                          formData={formData} errors={displayErrors} updateFormData={handleFieldChange}
                        />
                        <SearchableSelect
                          label="Program"
                          field="program"
                          required
                          placeholder={selectedFieldUid ? "Search programs…" : "Select a field first"}
                          loading={loadingPrograms && !!selectedFieldUid}
                          disabled={!selectedFieldUid && !preProgram}
                          options={
                            selectedFieldUid
                              ? programs.map((p) => ({ value: p.uid, label: p.name }))
                              : preProgram
                              ? [{ value: preProgram.uid, label: preProgram.name }]
                              : []
                          }
                          formData={formData} errors={displayErrors} updateFormData={update}
                        />
                      </div>
                    )}

                    {/* ── Step 2: Your Details ── */}
                    {step === 2 && (
                      <div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                          <InputField
                            label="Full Name" field="full_name" required
                            placeholder="John Doe"
                            formData={formData} errors={displayErrors} updateFormData={update}
                          />
                          <InputField
                            label="Email Address" field="email" type="email" required
                            placeholder="john@example.com"
                            formData={formData} errors={displayErrors} updateFormData={update}
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                          <InputField
                            label="Phone / WhatsApp" field="phone" type="tel" required
                            placeholder="+971 50 000 0000"
                            formData={formData} errors={displayErrors} updateFormData={update}
                          />
                          <InputField
                            label="Job Title" field="job_title" required={false}
                            placeholder="Software Engineer"
                            formData={formData} errors={displayErrors} updateFormData={update}
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                          <InputField
                            label="Address" field="address" required={false}
                            placeholder="123 Main St, Dubai, UAE"
                            formData={formData} errors={displayErrors} updateFormData={update}
                          />
                          <SearchableSelect
                            label="Registration Type" field="registration_type"
                            options={TYPE_OPTIONS}
                            placeholder="Select type…"
                            formData={formData} errors={displayErrors} updateFormData={update}
                          />
                        </div>
                      </div>
                    )}

                    {/* ── Step 3: Review ── */}
                    {step === 3 && (
                      <div className="space-y-4">
                        {/* Program summary */}
                        <div className="bg-slate-50 border border-slate-100 rounded-xl px-5 py-4">
                          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                            Selected Program
                          </p>
                          <SummaryRow label="Program"  value={selectedProgram?.name} />
                          <SummaryRow label="Field"    value={selectedField?.name} />
                          <SummaryRow label="Category" value={selectedCategory?.name} />
                        </div>

                        {/* Participant summary */}
                        <div className="bg-slate-50 border border-slate-100 rounded-xl px-5 py-4">
                          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                            Participant Details
                          </p>
                          <SummaryRow label="Full Name"          value={formData.full_name} />
                          <SummaryRow label="Email"              value={formData.email} />
                          <SummaryRow label="Phone"              value={formData.phone} />
                          <SummaryRow label="Job Title"          value={formData.job_title} />
                          <SummaryRow label="Registration Type"  value={formData.registration_type === "personal" ? "Personal" : "Corporate"} />
                        </div>
                      </div>
                    )}

                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation */}
              <div className="flex gap-3 mt-6">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={goBack}
                    className="flex-1 py-3 rounded-md lg:rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition"
                  >
                    Back
                  </button>
                )}

                {step < 3 ? (() => {
                  const step1Disabled = !formData.category || !formData.field || !formData.program;
                  const step2Disabled =
                    !formData.full_name.trim() ||
                    !formData.email.trim()     ||
                    !formData.phone.trim();
                  const continueDisabled = step === 1 ? step1Disabled : step2Disabled;
                  return (
                    <button
                      type="button"
                      onClick={goNext}
                      disabled={continueDisabled}
                      className="flex-1 py-3 rounded-md lg:rounded-lg bg-navy-700 hover:bg-navy-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold transition"
                    >
                      Continue
                    </button>
                  );
                })() : (
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className="flex-1 flex items-center justify-center gap-2 bg-navy-600 hover:bg-navy-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-3 rounded-md lg:rounded-lg transition-colors duration-200 text-sm"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <MdSend size={16} />
                        Complete Registration
                      </>
                    )}
                  </motion.button>
                )}
              </div>

              <p className="text-center text-slate-400 text-xs mt-3">
                Step {step} of 3 · No account required
              </p>
            </form>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default RegisterPage;
