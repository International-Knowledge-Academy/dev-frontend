// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MdSend } from "react-icons/md";
import { Check } from "lucide-react";
import { useToast } from "context/ToastContext";
import Navbar from "components/home/Navbar";
import Footer from "components/home/Footer";
import { InputField, SelectField, TextareaField } from "components/form";
import ImageUploadField from "components/form/images/ImageUploadField";
import FileUploadField  from "components/form/filesUpload/FileUploadField";
import useApplyAsTrainer from "hooks/trainers/useApplyAsTrainer";
import usePresignedUpload from "hooks/storage/usePresignedUpload";

const EXPERIENCE_OPTIONS = [
  { value: "1",  label: "1 – 2 years"  },
  { value: "3",  label: "3 – 5 years"  },
  { value: "6",  label: "6 – 10 years" },
  { value: "10", label: "10+ years"    },
];

const STEPS = [
  { number: 1, label: "Personal Info"       },
  { number: 2, label: "Professional Details" },
  { number: 3, label: "Location"            },
];

const initialForm = {
  name:          "", email:         "", phone:        "",
  whatsapp:      "", primary_email: "",
  title:         "", years_experience: "", linkedin_url: "",
  certifications:"", bio:           "",
  country:       "", city:          "", postal_code:  "", address: "",
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
            <div className={`w-16 sm:w-24 h-0.5 mb-5 mx-2 rounded-full transition-all duration-500 ${
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
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
  center: { opacity: 1, x: 0 },
  exit:  (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
};

/* ── Page ── */
const RegisterTrainerPage = () => {
  const navigate     = useNavigate();
  const { addToast } = useToast();
  const { apply, loading, error, fieldErrors } = useApplyAsTrainer();

  const {
    upload: uploadImage, uploading: uploadingImage,
    progress: imageProgress, reset: resetImage,
  } = usePresignedUpload();
  const {
    upload: uploadCv, uploading: uploadingCv,
    progress: cvProgress, reset: resetCv,
  } = usePresignedUpload();

  const [step, setStep]         = useState(1);
  const [dir,  setDir]          = useState(1);
  const [formData, setFormData] = useState(initialForm);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [cvFile,             setCvFile]             = useState<File | null>(null);
  const [profilePictureKey,  setProfilePictureKey]  = useState<string | null>(null);
  const [cvKey,              setCvKey]              = useState<string | null>(null);
  const [errors, setErrors]     = useState<Record<string, string>>({});

  const update = (field: string, value: string) => {
    setFormData((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
  };

  const validateStep = (s: number) => {
    const e: Record<string, string> = {};
    if (s === 1) {
      if (!formData.name.trim())  e.name  = "Full name is required";
      if (!formData.email.trim()) e.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = "Invalid email";
      if (!formData.phone.trim()) e.phone = "Phone is required";
    }
    if (s === 2) {
      if (!profilePictureKey) e.profile_picture = "Profile picture is required";
      if (!cvKey)             e.cv              = "CV / Resume is required";
      if (!formData.title.trim()) e.title       = "Job title is required";
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

  const handleProfilePictureChange = async (file: File) => {
    setProfilePictureFile(file);
    setProfilePictureUrl(null);
    if (errors.profile_picture) setErrors((p) => ({ ...p, profile_picture: "" }));
    const result = await uploadImage(file, { folder: "trainers/profile-pictures", file_type: "image" });
    if (result) setProfilePictureKey(result.file_key);
  };

  const handleCvChange = async (file: File) => {
    setCvFile(file);
    setCvUrl(null);
    if (errors.cv) setErrors((p) => ({ ...p, cv: "" }));
    const result = await uploadCv(file, { folder: "trainers/cvs", file_type: "document" });
    if (result) setCvKey(result.file_key);
  };

  const handleProfilePictureRemove = () => {
    setProfilePictureFile(null);
    setProfilePictureKey(null);
    resetImage();
  };

  const handleCvRemove = () => {
    setCvFile(null);
    setCvKey(null);
    resetCv();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await apply({
      name:             formData.name,
      email:            formData.email,
      phone:            formData.phone            || undefined,
      whatsapp:         formData.whatsapp         || undefined,
      primary_email:    formData.primary_email    || undefined,
      title:            formData.title            || undefined,
      years_experience: formData.years_experience ? Number(formData.years_experience) : undefined,
      linkedin_url:     formData.linkedin_url     || undefined,
      certifications:   formData.certifications   || undefined,
      bio:              formData.bio              || undefined,
      country:          formData.country          || undefined,
      city:             formData.city             || undefined,
      postal_code:      formData.postal_code      || undefined,
      address:          formData.address          || undefined,
      profile_picture:  profilePictureKey          || undefined,
      cv:               cvKey                     || undefined,
    });
    if (ok) {
      addToast("Application submitted! We'll be in touch soon.", "success");
      navigate("/register/trainer/success");
    }
  };

  const displayErrors = { ...errors, ...fieldErrors };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Hero — unchanged */}
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
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden"
        >
          {/* Card header — unchanged */}
          <div className="bg-navy-600 px-8 py-7 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gold-500 opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            <h3 className="text-white font-extrabold text-xl relative">Trainer Application</h3>
            <p className="text-navy-200 text-sm mt-1 relative">
              We review every application within 3 business days and will contact you via email.
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

                    {/* ── Step 1: Personal Info ── */}
                    {step === 1 && (
                      <div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                          <InputField
                            label="Full Name" field="name" required
                            placeholder="Jane Smith"
                            formData={formData} errors={displayErrors} updateFormData={update}
                          />
                          <InputField
                            label="Email Address" field="email" type="email" required
                            placeholder="jane@example.com"
                            formData={formData} errors={displayErrors} updateFormData={update}
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                          <InputField
                            label="Phone" field="phone" type="tel" required
                            placeholder="+971 50 000 0000"
                            formData={formData} errors={displayErrors} updateFormData={update}
                          />
                          <InputField
                            label="WhatsApp" field="whatsapp" type="tel" required={false}
                            placeholder="+971 50 000 0000"
                            formData={formData} errors={displayErrors} updateFormData={update}
                          />
                        </div>
                        <InputField
                          label="Primary Email" field="primary_email" type="email" required={false}
                          placeholder="primary@example.com"
                          formData={formData} errors={displayErrors} updateFormData={update}
                        />
                      </div>
                    )}

                    {/* ── Step 2: Professional Details ── */}
                    {step === 2 && (
                      <div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                          <ImageUploadField
                            label="Profile Picture"
                            field="profile_picture"
                            imageOnly
                            required
                            simpleFile={profilePictureFile}
                            onSimpleFileChange={handleProfilePictureChange}
                            onSimpleRemove={handleProfilePictureRemove}
                            simpleUploading={uploadingImage}
                            simpleProgress={imageProgress}
                            errors={displayErrors}
                          />
                          <FileUploadField
                            label="CV / Resume"
                            field="cv"
                            required
                            simpleFile={cvFile}
                            onSimpleFileChange={handleCvChange}
                            onSimpleRemove={handleCvRemove}
                            simpleUploading={uploadingCv}
                            simpleProgress={cvProgress}
                            errors={displayErrors}
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                          <InputField
                            label="Current Job Title" field="title" required
                            placeholder="Senior Consultant"
                            formData={formData} errors={displayErrors} updateFormData={update}
                          />
                          <SelectField
                            label="Years of Experience" field="years_experience" required={false}
                            options={EXPERIENCE_OPTIONS}
                            formData={formData} errors={displayErrors} updateFormData={update}
                          />
                        </div>
                        <InputField
                          label="LinkedIn Profile" field="linkedin_url" required={false}
                          placeholder="https://linkedin.com/in/..."
                          formData={formData} errors={displayErrors} updateFormData={update}
                        />
                        <TextareaField
                          label="Certifications & Areas of Expertise" field="certifications" required={false} rows={3}
                          placeholder="e.g. PMP, Project Management, Leadership, Data Analysis..."
                          formData={formData} errors={displayErrors} updateFormData={update}
                        />
                        <TextareaField
                          label="Brief Bio" field="bio" required={false} rows={4}
                          placeholder="Tell us about your background, industry experience, and why you want to train with IKA..."
                          formData={formData} errors={displayErrors} updateFormData={update}
                        />
                      </div>
                    )}

                    {/* ── Step 3: Location ── */}
                    {step === 3 && (
                      <div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                          <InputField
                            label="Country" field="country" required={false}
                            placeholder="United Arab Emirates"
                            formData={formData} errors={displayErrors} updateFormData={update}
                          />
                          <InputField
                            label="City" field="city" required={false}
                            placeholder="Dubai"
                            formData={formData} errors={displayErrors} updateFormData={update}
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                          <InputField
                            label="Postal Code" field="postal_code" required={false}
                            placeholder="00000"
                            formData={formData} errors={displayErrors} updateFormData={update}
                          />
                          <InputField
                            label="Address" field="address" required={false}
                            placeholder="123 Main St"
                            formData={formData} errors={displayErrors} updateFormData={update}
                          />
                        </div>

                        {/* Summary preview */}
                        <div className="mt-2 mb-4 bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 space-y-1.5">
                          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Application Summary</p>
                          {[
                            { label: "Name",  value: formData.name  },
                            { label: "Email", value: formData.email },
                            { label: "Phone", value: formData.phone },
                            { label: "Title", value: formData.title || "—" },
                          ].map((row) => (
                            <div key={row.label} className="flex items-center justify-between text-sm">
                              <span className="text-slate-400">{row.label}</span>
                              <span className="text-navy-800 font-medium">{row.value}</span>
                            </div>
                          ))}
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
                    className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition"
                  >
                    Back
                  </button>
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={
                      (step === 1 && (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim())) ||
                      (step === 2 && (!profilePictureKey || !cvKey || !formData.title.trim() || uploadingImage || uploadingCv))
                    }
                    className="flex-1 py-3 rounded-xl bg-navy-700 hover:bg-navy-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold transition"
                  >
                    Continue
                  </button>
                ) : (
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className="flex-1 flex items-center justify-center gap-2 bg-navy-600 hover:bg-navy-700 disabled:opacity-70 text-white font-bold py-3 rounded-xl transition-colors duration-200 text-sm"
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
                        Submit Application
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

export default RegisterTrainerPage;
