// @ts-nocheck
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { MdSend } from "react-icons/md";
import { useToast } from "context/ToastContext";
import Navbar from "components/home/Navbar";
import Footer from "components/home/Footer";
import { InputField, SelectField } from "components/form";
import useGetProgram from "hooks/programs/useGetProgram";
import useAllCategories from "hooks/categories/useAllCategories";
import useFields from "hooks/fields/useFields";
import usePrograms from "hooks/programs/usePrograms";
import useCreateRegistration from "hooks/registrations/useCreateRegistration";

const TYPE_OPTIONS = [
  { value: "personal",  label: "Personal"  },
  { value: "corporate", label: "Corporate" },
];

const RegisterPage = () => {
  const navigate       = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToast }   = useToast();
  const preselectedUid = searchParams.get("uid") ?? undefined;

  const { program: preProgram } = useGetProgram(preselectedUid);

  const [selectedCategoryUid, setSelectedCategoryUid] = useState("");
  const [selectedFieldUid, setSelectedFieldUid]       = useState("");

  const { categories, loading: loadingCats } = useAllCategories();
  const { fields, loading: loadingFields }   = useFields(
    selectedCategoryUid ? { category: selectedCategoryUid, is_active: true } : {}
  );
  const { programs, loading: loadingPrograms } = usePrograms(
    selectedFieldUid ? { field: selectedFieldUid, is_active: true } : {}
  );

  const { createRegistration, loading, error, fieldErrors } = useCreateRegistration();

  const [formData, setFormData] = useState({
    category:          "",
    field:             "",
    program:           "",
    registration_type: "personal",
    full_name:         "",
    email:             "",
    phone:             "",
    job_title:         "",
    address:           "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
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
    update("field", "");
    update("program", "");
    setSelectedFieldUid("");
  };

  const handleFieldChange = (key: string, val: string) => {
    update(key, val);
    setSelectedFieldUid(val);
    update("program", "");
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.program)         e.program   = "Please select a program";
    if (!formData.full_name.trim()) e.full_name = "Full name is required";
    if (!formData.email.trim())    e.email     = "Email address is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = "Invalid email format";
    if (!formData.phone.trim())    e.phone     = "Phone number is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const created = await createRegistration({
      program_uid:       formData.program,
      registration_type: formData.registration_type,
      full_name:         formData.full_name,
      email:             formData.email,
      phone:             formData.phone,
      job_title:         formData.job_title,
      address:           formData.address,
    });
    if (created) {
      addToast("Registration submitted successfully! We'll be in touch shortly.", "success");
      navigate("/register/success");
    }
  };

  const displayErrors = { ...errors, ...fieldErrors };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="bg-navy-800 pt-28 pb-12 relative overflow-hidden">
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
            Select a category, then a field, then choose your program and fill in your details.
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
            {error && (
              <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Program selection */}
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                Select Program
              </p>

              <SelectField
                label={loadingCats ? "Loading..." : "Category"}
                field="category"
                required={false}
                options={categories.map((c) => ({ value: c.uid, label: c.name }))}
                formData={formData} errors={displayErrors} updateFormData={handleCategoryChange}
              />

              <SelectField
                label={loadingFields && selectedCategoryUid ? "Loading Fields..." : "Field"}
                field="field"
                required={false}
                options={selectedCategoryUid ? fields.map((f) => ({ value: f.uid, label: f.name })) : []}
                formData={formData} errors={displayErrors} updateFormData={handleFieldChange}
              />

              <SelectField
                label={loadingPrograms && selectedFieldUid ? "Loading Programs..." : "Program"}
                field="program"
                required
                options={
                  selectedFieldUid
                    ? programs.map((p) => ({ value: p.uid, label: p.name }))
                    : preProgram
                    ? [{ value: preProgram.uid, label: preProgram.name }]
                    : []
                }
                formData={formData} errors={displayErrors} updateFormData={update}
              />

              {/* Participant details */}
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 mt-2">
                Your Details
              </p>

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
                <SelectField
                  label="Registration Type" field="registration_type"
                  options={TYPE_OPTIONS}
                  formData={formData} errors={displayErrors} updateFormData={update}
                />
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="w-full flex items-center justify-center gap-2 bg-navy-600 hover:bg-navy-700 disabled:opacity-70 text-white font-bold py-3.5 rounded-xl transition-colors duration-200 text-sm mt-2"
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

              <p className="text-center text-slate-400 text-xs mt-3">
                No account required · We'll confirm your enrollment within 24 hours
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
