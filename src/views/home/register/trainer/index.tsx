// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "context/ToastContext";
import Navbar from "components/home/Navbar";
import Footer from "components/home/Footer";
import InputField from "components/form/InputField";
import Button from "components/ui/buttons/Button";
import useApplyAsTrainer from "hooks/trainers/useApplyAsTrainer";

const EXPERIENCE_OPTIONS = [
  { value: "1-2",  label: "1 – 2 years"  },
  { value: "3-5",  label: "3 – 5 years"  },
  { value: "6-10", label: "6 – 10 years" },
  { value: "10+",  label: "10+ years"    },
];

const RegisterTrainerPage = () => {
  const navigate     = useNavigate();
  const { addToast } = useToast();
  const { apply, loading, error, fieldErrors } = useApplyAsTrainer();

  const [form, setForm] = useState({
    full_name:            "",
    email:                "",
    phone:                "",
    job_title:            "",
    years_of_experience:  "",
    expertise_areas:      "",
    bio:                  "",
    linkedin_url:         "",
  });

  const update = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const isValid =
    form.full_name.trim() !== "" &&
    form.email.trim()     !== "" &&
    form.phone.trim()     !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await apply({
      full_name:           form.full_name,
      email:               form.email,
      phone:               form.phone,
      job_title:           form.job_title   || undefined,
      years_of_experience: form.years_of_experience || undefined,
      expertise_areas:     form.expertise_areas     || undefined,
      bio:                 form.bio                 || undefined,
      linkedin_url:        form.linkedin_url        || undefined,
    });
    if (ok) {
      addToast("Application submitted! We'll be in touch soon.", "success");
      navigate("/register/trainer/success");
    }
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
            Apply to Be a Trainer
          </h1>
          <p className="text-navy-300 text-base max-w-xl mx-auto">
            Share your expertise with professionals across industries. Fill in your details and our team will be in touch within 3 business days.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto w-full px-6 py-12">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <form onSubmit={handleSubmit}>

            {/* ── Personal Info ── */}
            <div className="px-6 pt-6 pb-4 border-b border-slate-100">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                Personal Information
              </p>

              {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 mb-4">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                <InputField
                  label="Full Name"
                  field="full_name"
                  placeholder="Jane Smith"
                  formData={form}
                  errors={fieldErrors}
                  updateFormData={update}
                />
                <InputField
                  label="Email"
                  field="email"
                  type="email"
                  placeholder="jane@example.com"
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
                  label="Current Job Title"
                  field="job_title"
                  placeholder="Senior Engineer / Consultant"
                  required={false}
                  formData={form}
                  errors={fieldErrors}
                  updateFormData={update}
                />
              </div>
              <InputField
                label="LinkedIn Profile"
                field="linkedin_url"
                placeholder="https://linkedin.com/in/yourname"
                required={false}
                formData={form}
                errors={fieldErrors}
                updateFormData={update}
              />
            </div>

            {/* ── Expertise ── */}
            <div className="px-6 pt-6 pb-4 border-b border-slate-100">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                Expertise & Experience
              </p>

              {/* Years of experience — manual select using native select for now */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-navy-800 mb-1.5">
                  Years of Experience
                  <span className="text-slate-400 font-normal ml-1">(optional)</span>
                </label>
                <select
                  value={form.years_of_experience}
                  onChange={(e) => update("years_of_experience", e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-200 focus:border-navy-400 transition"
                >
                  <option value="">Select range</option>
                  {EXPERIENCE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-navy-800 mb-1.5">
                  Areas of Expertise
                  <span className="text-slate-400 font-normal ml-1">(optional)</span>
                </label>
                <textarea
                  value={form.expertise_areas}
                  onChange={(e) => update("expertise_areas", e.target.value)}
                  placeholder="e.g. Project Management, Leadership, Data Analysis..."
                  rows={3}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-navy-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-navy-200 focus:border-navy-400 transition resize-none"
                />
                {fieldErrors.expertise_areas && (
                  <p className="text-xs text-red-500 mt-1">{fieldErrors.expertise_areas}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-800 mb-1.5">
                  Brief Bio
                  <span className="text-slate-400 font-normal ml-1">(optional)</span>
                </label>
                <textarea
                  value={form.bio}
                  onChange={(e) => update("bio", e.target.value)}
                  placeholder="Tell us about your background, industry experience, and why you want to train with IKA..."
                  rows={4}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-navy-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-navy-200 focus:border-navy-400 transition resize-none"
                />
                {fieldErrors.bio && (
                  <p className="text-xs text-red-500 mt-1">{fieldErrors.bio}</p>
                )}
              </div>
            </div>

            {/* ── Submit ── */}
            <div className="px-6 py-5 flex flex-col gap-3">
              <Button
                type="submit"
                variant="primary"
                text={loading ? "Submitting..." : "Submit Application"}
                disabled={loading || !isValid}
                className="w-full py-3"
              />
              <p className="text-xs text-slate-400 text-center">
                We review every application within 3 business days and will contact you via email.
              </p>
            </div>

          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RegisterTrainerPage;
