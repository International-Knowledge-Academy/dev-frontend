// @ts-nocheck
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ChevronRight, GraduationCap, CheckCircle2, Calendar,
  Clock, MapPin, Globe, DollarSign, User, Mail, Phone,
  Briefcase, Home, ChevronDown, Loader2, ArrowLeft,
} from "lucide-react";
import Navbar from "components/home/Navbar";
import Footer from "components/home/Footer";
import Loading from "components/loading/Loading";
import useGetProgram from "hooks/programs/useGetProgram";
import useAllCategories from "hooks/categories/useAllCategories";
import useFields from "hooks/fields/useFields";
import usePrograms from "hooks/programs/usePrograms";
import useCreateRegistration from "hooks/registrations/useCreateRegistration";

/* ─── Helpers ──────────────────────────────────────────────────────────────── */

const formatDate = (d: string | null) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : null;

/* ─── Selected program card ─────────────────────────────────────────────────── */

const ProgramCard = ({ program, onClear }: { program: any; onClear?: () => void }) => (
  <div className="flex items-start gap-4 bg-navy-800 text-white rounded-2xl p-5 relative overflow-hidden">
    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-300" />
    <div className="w-11 h-11 rounded-xl bg-gold-500/20 flex items-center justify-center flex-shrink-0">
      <GraduationCap size={20} className="text-gold-400" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-bold text-base leading-tight">{program.name}</p>
      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-navy-300">
        {program.field?.name && (
          <span className="flex items-center gap-1"><Globe size={11} />{program.field.name}</span>
        )}
        {formatDate(program.start_date) && (
          <span className="flex items-center gap-1"><Calendar size={11} />{formatDate(program.start_date)}</span>
        )}
        {program.duration && (
          <span className="flex items-center gap-1"><Clock size={11} />{program.duration}</span>
        )}
        {program.location?.city && (
          <span className="flex items-center gap-1"><MapPin size={11} />{program.location.city}</span>
        )}
      </div>
      {program.price && (
        <p className="text-gold-400 font-bold text-sm mt-2">
          {program.currency ?? "$"}{program.price} <span className="text-navy-400 font-normal text-xs">/ person</span>
        </p>
      )}
    </div>
    {onClear && (
      <button
        type="button"
        onClick={onClear}
        className="text-navy-400 hover:text-white transition text-xs underline underline-offset-2 flex-shrink-0 mt-0.5"
      >
        Change
      </button>
    )}
  </div>
);

/* ─── Select field ──────────────────────────────────────────────────────────── */

const SelectField = ({ label, value, onChange, options, placeholder, disabled = false, loading = false }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-navy-700 uppercase tracking-widest">{label}</label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || loading}
        className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-navy-800 focus:outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-100 disabled:bg-slate-50 disabled:text-slate-400 pr-10"
      >
        <option value="">{loading ? "Loading..." : placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
  </div>
);

/* ─── Form input ─────────────────────────────────────────────────────────────── */

const FormInput = ({ icon: Icon, label, required = true, error, ...inputProps }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-navy-700 uppercase tracking-widest">
      {label}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
      )}
      <input
        {...inputProps}
        className={`w-full bg-white border rounded-xl px-4 py-3 text-sm text-navy-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-navy-100 transition ${
          Icon ? "pl-10" : ""
        } ${error ? "border-red-300 focus:border-red-400" : "border-slate-200 focus:border-navy-400"}`}
      />
    </div>
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

/* ─── Main page ──────────────────────────────────────────────────────────────── */

const RegisterPage = () => {
  const navigate      = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedUid = searchParams.get("uid") ?? undefined;

  /* Pre-selected program (via ?uid= query param from program page) */
  const { program: preProgram, loading: loadingPre } = useGetProgram(preselectedUid);

  /* Browse state */
  const [selectedCategoryUid, setSelectedCategoryUid] = useState("");
  const [selectedFieldUid, setSelectedFieldUid]       = useState("");
  const [selectedProgram, setSelectedProgram]         = useState<any>(null);

  /* Data hooks */
  const { categories, loading: loadingCats } = useAllCategories();
  const { fields, loading: loadingFields }   = useFields(
    selectedCategoryUid ? { category: selectedCategoryUid, is_active: true } : {}
  );
  const { programs, loading: loadingPrograms } = usePrograms(
    selectedFieldUid ? { field: selectedFieldUid, is_active: true } : {}
  );

  /* Registration form */
  const { createRegistration, loading: submitting, error: submitError, fieldErrors } = useCreateRegistration();

  const [form, setForm] = useState({
    full_name:         "",
    email:             "",
    phone:             "",
    job_title:         "",
    address:           "",
    registration_type: "personal",
  });

  /* When pre-selected program loads, use it */
  useEffect(() => {
    if (preProgram) {
      setSelectedProgram(preProgram);
    }
  }, [preProgram]);

  /* Reset field + program when category changes */
  useEffect(() => {
    setSelectedFieldUid("");
    setSelectedProgram(null);
  }, [selectedCategoryUid]);

  /* Reset program when field changes */
  useEffect(() => {
    setSelectedProgram(null);
  }, [selectedFieldUid]);

  const update = (key: string, value: string) =>
    setForm((p) => ({ ...p, [key]: value }));

  const activeProgram = selectedProgram;
  const isFormValid =
    !!activeProgram &&
    form.full_name.trim() !== "" &&
    form.email.trim() !== "" &&
    form.phone.trim() !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activeProgram?.id) return;

    const payload = {
      ...form,
      program:       activeProgram.id,
      program_price: activeProgram.price ?? undefined,
    };

    const created = await createRegistration(payload);
    if (created) {
      navigate("/register/success");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="bg-navy-800 pt-28 pb-14 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.8) 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500 opacity-[0.06] rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 relative">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-navy-300 hover:text-white text-sm font-medium transition mb-6 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            Back
          </button>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Register for a Program
          </h1>
          <p className="text-navy-300 text-base max-w-xl">
            Select a program from our catalog or browse by category and field, then complete your details.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto w-full px-6 py-12 space-y-8">

        {/* ── Step 1: Program Selection ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-navy-800 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
              1
            </div>
            <div>
              <h2 className="text-sm font-bold text-navy-800">Select a Program</h2>
              <p className="text-xs text-slate-400 mt-0.5">Browse by category and field, or choose directly</p>
            </div>
          </div>

          <div className="px-6 py-5 space-y-5">
            {/* Loading pre-selected program */}
            {preselectedUid && loadingPre && (
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <Loader2 size={16} className="animate-spin" />
                Loading program details...
              </div>
            )}

            {/* Pre-selected / manually selected program card */}
            {activeProgram && (
              <div>
                <p className="text-xs text-slate-400 mb-2 font-medium">Selected Program</p>
                <ProgramCard
                  program={activeProgram}
                  onClear={!preselectedUid ? () => setSelectedProgram(null) : undefined}
                />
                {preselectedUid && (
                  <button
                    type="button"
                    onClick={() => navigate("/register")}
                    className="text-xs text-slate-400 hover:text-navy-600 transition mt-2 underline underline-offset-2"
                  >
                    Choose a different program
                  </button>
                )}
              </div>
            )}

            {/* Browse flow — only show if no program pre-selected via URL */}
            {!preselectedUid && (
              <>
                {!activeProgram && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <SelectField
                      label="Category"
                      value={selectedCategoryUid}
                      onChange={setSelectedCategoryUid}
                      options={categories.map((c) => ({ value: c.uid, label: c.name }))}
                      placeholder="All Categories"
                      loading={loadingCats}
                    />
                    <SelectField
                      label="Field"
                      value={selectedFieldUid}
                      onChange={setSelectedFieldUid}
                      options={fields.map((f) => ({ value: f.uid, label: f.name }))}
                      placeholder={selectedCategoryUid ? "Select field..." : "Select a category first"}
                      disabled={!selectedCategoryUid}
                      loading={loadingFields && !!selectedCategoryUid}
                    />
                  </div>
                )}

                {/* Program list */}
                {!activeProgram && (
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                      {selectedFieldUid ? "Programs in this field" : "Available Programs"}
                    </p>
                    {loadingPrograms ? (
                      <div className="flex items-center gap-3 text-sm text-slate-400 py-4">
                        <Loader2 size={16} className="animate-spin" />
                        Loading programs...
                      </div>
                    ) : programs.length === 0 ? (
                      <p className="text-sm text-slate-400 py-4">
                        {selectedFieldUid
                          ? "No programs found for this field."
                          : "Select a field to browse programs, or choose any available program below."}
                      </p>
                    ) : (
                      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                        {programs.map((p) => (
                          <button
                            key={p.uid}
                            type="button"
                            onClick={() => setSelectedProgram(p)}
                            className="w-full text-left flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-navy-200 hover:bg-navy-50/50 transition group"
                          >
                            <div className="w-9 h-9 rounded-lg bg-navy-50 flex items-center justify-center flex-shrink-0 group-hover:bg-navy-100 transition">
                              <GraduationCap size={16} className="text-navy-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-navy-800 truncate">{p.name}</p>
                              <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-400">
                                {p.field?.name && <span>{p.field.name}</span>}
                                {p.price && (
                                  <span className="font-semibold text-gold-600">
                                    {p.currency ?? "$"}{p.price}
                                  </span>
                                )}
                                {formatDate(p.start_date) && <span>{formatDate(p.start_date)}</span>}
                              </div>
                            </div>
                            <ChevronRight size={14} className="text-slate-300 group-hover:text-navy-500 flex-shrink-0 transition" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ── Step 2: Registration Form ── */}
        <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
          activeProgram ? "border-slate-100 opacity-100" : "border-slate-100 opacity-50 pointer-events-none"
        }`}>
          <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full text-white flex items-center justify-center text-sm font-bold flex-shrink-0 ${
              activeProgram ? "bg-navy-800" : "bg-slate-300"
            }`}>
              2
            </div>
            <div>
              <h2 className="text-sm font-bold text-navy-800">Your Details</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {activeProgram ? "Fill in your information to complete registration" : "Select a program first"}
              </p>
            </div>
            {activeProgram && (
              <CheckCircle2 size={18} className="ml-auto text-green-500 flex-shrink-0" />
            )}
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
            {submitError && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                {submitError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                icon={User}
                label="Full Name"
                value={form.full_name}
                onChange={(e) => update("full_name", e.target.value)}
                placeholder="John Doe"
                error={fieldErrors?.full_name}
              />
              <FormInput
                icon={Mail}
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="john@example.com"
                error={fieldErrors?.email}
              />
              <FormInput
                icon={Phone}
                label="Phone"
                type="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="+971 50 000 0000"
                error={fieldErrors?.phone}
              />
              <FormInput
                icon={Briefcase}
                label="Job Title"
                required={false}
                value={form.job_title}
                onChange={(e) => update("job_title", e.target.value)}
                placeholder="Software Engineer"
                error={fieldErrors?.job_title}
              />
            </div>

            <FormInput
              icon={Home}
              label="Address"
              required={false}
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              placeholder="123 Main St, Dubai, UAE"
              error={fieldErrors?.address}
            />

            {/* Registration type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-navy-700 uppercase tracking-widest">
                Registration Type <span className="text-red-400">*</span>
              </label>
              <div className="inline-flex rounded-xl border border-slate-200 p-1 bg-slate-50 gap-1 w-full sm:w-auto">
                {["personal", "corporate"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => update("registration_type", t)}
                    className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-medium transition capitalize ${
                      form.registration_type === t
                        ? "bg-navy-800 text-white shadow-sm"
                        : "text-slate-500 hover:text-navy-700"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Price preview */}
            {activeProgram?.price && (
              <div className="flex items-center justify-between bg-gold-50 border border-gold-200 rounded-xl px-5 py-4">
                <div className="flex items-center gap-2 text-sm text-navy-700 font-semibold">
                  <DollarSign size={15} className="text-gold-500" />
                  Program Investment
                </div>
                <span className="text-gold-600 font-extrabold text-lg tabular-nums">
                  {activeProgram.currency ?? "$"}{activeProgram.price}
                </span>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting || !isFormValid}
                className="w-full bg-gold-500 hover:bg-gold-400 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-navy-900 font-bold py-4 rounded-xl text-sm transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 disabled:translate-y-0 disabled:shadow-none flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Complete Registration
                    <ChevronRight size={16} />
                  </>
                )}
              </button>
              <p className="text-xs text-slate-400 text-center mt-3">
                By registering, you agree to our terms and conditions. We'll contact you to confirm your enrollment.
              </p>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RegisterPage;
