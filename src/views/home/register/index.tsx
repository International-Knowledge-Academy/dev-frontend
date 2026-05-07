// @ts-nocheck
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { GraduationCap, Calendar, Clock, MapPin, DollarSign } from "lucide-react";
import Navbar from "components/home/Navbar";
import Footer from "components/home/Footer";
import InputField from "components/form/InputField";
import SelectField from "components/form/SelectField";
import Button from "components/ui/buttons/Button";
import useGetProgram from "hooks/programs/useGetProgram";
import useAllCategories from "hooks/categories/useAllCategories";
import useFields from "hooks/fields/useFields";
import usePrograms from "hooks/programs/usePrograms";
import useCreateRegistration from "hooks/registrations/useCreateRegistration";

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : null;

const TYPE_OPTIONS = [
  { value: "personal",  label: "Personal"  },
  { value: "corporate", label: "Corporate" },
];

const RegisterPage = () => {
  const navigate       = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedUid = searchParams.get("uid") ?? undefined;

  /* Pre-selected program via ?uid= */
  const { program: preProgram } = useGetProgram(preselectedUid);

  /* Cascade selects */
  const [selectedCategoryUid, setSelectedCategoryUid] = useState("");
  const [selectedFieldUid, setSelectedFieldUid]       = useState("");

  /* Data hooks */
  const { categories, loading: loadingCats } = useAllCategories();
  const { fields, loading: loadingFields }   = useFields(
    selectedCategoryUid ? { category: selectedCategoryUid, is_active: true } : {}
  );
  const { programs, loading: loadingPrograms } = usePrograms(
    selectedFieldUid ? { field: selectedFieldUid, is_active: true } : {}
  );

  const { createRegistration, loading: submitting, error, fieldErrors } = useCreateRegistration();

  /* Form */
  const [form, setForm] = useState({
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

  const update = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  /* Pre-fill when arriving from program page */
  useEffect(() => {
    if (preProgram) {
      update("program", String(preProgram.id ?? ""));
      if (preProgram.field?.uid) {
        setSelectedFieldUid(preProgram.field.uid);
        update("field", preProgram.field.uid);
      }
    }
  }, [preProgram]);

  /* Category change — reset field + program */
  const handleCategoryChange = (key, val) => {
    update(key, val);
    setSelectedCategoryUid(val);
    update("field", "");
    update("program", "");
    setSelectedFieldUid("");
  };

  /* Field change — reset program */
  const handleFieldChange = (key, val) => {
    update(key, val);
    setSelectedFieldUid(val);
    update("program", "");
  };

  /* Resolve selected program object for preview */
  const selectedProgramObj =
    (preProgram && String(preProgram.id) === form.program)
      ? preProgram
      : programs.find((p) => String(p.id) === form.program) ?? null;

  const isValid =
    form.program !== "" &&
    form.full_name.trim() !== "" &&
    form.email.trim() !== "" &&
    form.phone.trim() !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      registration_type: form.registration_type,
      full_name:         form.full_name,
      email:             form.email,
      phone:             form.phone,
      job_title:         form.job_title,
      address:           form.address,
      program:           Number(form.program),
      program_price:     selectedProgramObj?.price ?? undefined,
    };
    const created = await createRegistration(payload);
    if (created) navigate("/register/success");
  };

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
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <form onSubmit={handleSubmit}>

            {/* ── Program Selection ── */}
            <div className="px-6 pt-6 pb-2 border-b border-slate-100">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                Select Program
              </p>

              {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 mb-4">
                  {error}
                </div>
              )}

              {/* Category */}
              <SelectField
                label={loadingCats ? "Loading..." : "Category"}
                field="category"
                required={false}
                options={categories.map((c) => ({ value: c.uid, label: c.name }))}
                formData={form}
                errors={fieldErrors}
                updateFormData={handleCategoryChange}
              />

              {/* Field — only after category picked */}
              <SelectField
                label={loadingFields && selectedCategoryUid ? "Loading Fields..." : "Field"}
                field="field"
                required={false}
                options={
                  selectedCategoryUid
                    ? fields.map((f) => ({ value: f.uid, label: f.name }))
                    : []
                }
                formData={form}
                errors={fieldErrors}
                updateFormData={handleFieldChange}
              />

              {/* Program — only after field picked */}
              <SelectField
                label={loadingPrograms && selectedFieldUid ? "Loading Programs..." : "Program"}
                field="program"
                required={true}
                options={
                  selectedFieldUid
                    ? programs.map((p) => ({ value: String(p.id ?? ""), label: p.name }))
                    : preProgram
                    ? [{ value: String(preProgram.id ?? ""), label: preProgram.name }]
                    : []
                }
                formData={form}
                errors={fieldErrors}
                updateFormData={update}
              />

            </div>

            {/* ── Participant Details ── */}
            <div className="px-6 pt-6 pb-2 border-b border-slate-100">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                Your Details
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                <InputField
                  label="Full Name"
                  field="full_name"
                  placeholder="John Doe"
                  formData={form}
                  errors={fieldErrors}
                  updateFormData={update}
                />
                <InputField
                  label="Email"
                  field="email"
                  type="email"
                  placeholder="john@example.com"
                  formData={form}
                  errors={fieldErrors}
                  updateFormData={update}
                />
                <InputField
                  label="Phone"
                  field="phone"
                  placeholder="+971 50 000 0000"
                  formData={form}
                  errors={fieldErrors}
                  updateFormData={update}
                />
                <InputField
                  label="Job Title"
                  field="job_title"
                  placeholder="Software Engineer"
                  required={false}
                  formData={form}
                  errors={fieldErrors}
                  updateFormData={update}
                />
              </div>
              <InputField
                label="Address"
                field="address"
                placeholder="123 Main St, Dubai, UAE"
                required={false}
                formData={form}
                errors={fieldErrors}
                updateFormData={update}
              />
              <SelectField
                label="Registration Type"
                field="registration_type"
                options={TYPE_OPTIONS}
                formData={form}
                errors={fieldErrors}
                updateFormData={update}
              />
            </div>

            {/* ── Submit ── */}
            <div className="px-6 py-5 flex flex-col gap-3">
              <Button
                type="submit"
                variant="primary"
                text={submitting ? "Submitting..." : "Complete Registration"}
                disabled={submitting || !isValid}
                className="w-full py-3"
              />
              <p className="text-xs text-slate-400 text-center">
                By registering you agree to our terms. We'll contact you to confirm your enrollment.
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
