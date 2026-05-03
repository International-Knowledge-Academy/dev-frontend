// @ts-nocheck
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdSend, MdCheckCircle } from "react-icons/md";
import { InputField, SelectField, TextareaField } from "components/form";
import useCategories from "hooks/categories/useCategories";

const programTypeOptions = [
  { value: "course",     label: "Training Course (5 Days)" },
  { value: "diploma",    label: "Training Diploma (10 Days)" },
  { value: "contracted", label: "Contracted / Custom Program" },
];

const initialForm = {
  name:         "",
  organization: "",
  email:        "",
  phone:        "",
  category:     "",
  program_type: "",
  message:      "",
};

const ContactForm = () => {
  const [formData, setFormData]   = useState(initialForm);
  const [errors, setErrors]       = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);

  const { categories } = useCategories({ is_active: true, ordering: "display_order" });

  const categoryOptions = categories.map((c) => ({ value: c.uid, label: c.name }));

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.name.trim())    e.name    = "Full name is required";
    if (!formData.email.trim())   e.email   = "Email address is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = "Invalid email format";
    if (!formData.message.trim()) e.message = "Please write a message";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    // Simulate API call — wire to real endpoint later
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="bg-navy-600 px-8 py-7 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gold-500 opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <h3 className="text-white font-extrabold text-xl relative">Send Us a Message</h3>
        <p className="text-navy-200 text-sm mt-1 relative">
          Fill in the details below and we'll get back to you within 24 hours.
        </p>
      </div>

      <div className="px-8 py-8">
        <AnimatePresence mode="wait">
          {submitted ? (
            /* Success state */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "backOut" }}
              className="py-10 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-green-50 text-green-500 flex items-center justify-center mb-5">
                <MdCheckCircle size={36} />
              </div>
              <h4 className="text-navy-800 font-extrabold text-xl mb-2">Message Sent!</h4>
              <p className="text-slate-500 text-sm max-w-xs">
                Thank you for reaching out. Our team will contact you within 24 hours.
              </p>
              <button
                onClick={() => { setFormData(initialForm); setErrors({}); setSubmitted(false); }}
                className="mt-7 text-sm font-semibold text-gold-600 hover:text-gold-700 underline underline-offset-2 transition"
              >
                Send another message
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Row 1: Name + Organization */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                <InputField
                  label="Full Name"
                  field="name"
                  required
                  placeholder="Your full name"
                  formData={formData}
                  errors={errors}
                  updateFormData={updateFormData}
                />
                <InputField
                  label="Organization"
                  field="organization"
                  required={false}
                  placeholder="Company or institution"
                  formData={formData}
                  errors={errors}
                  updateFormData={updateFormData}
                />
              </div>

              {/* Row 2: Email + Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                <InputField
                  label="Email Address"
                  field="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  formData={formData}
                  errors={errors}
                  updateFormData={updateFormData}
                />
                <InputField
                  label="Phone / WhatsApp"
                  field="phone"
                  type="tel"
                  required={false}
                  placeholder="+1 234 567 890"
                  formData={formData}
                  errors={errors}
                  updateFormData={updateFormData}
                />
              </div>

              {/* Row 3: Category + Program Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                <SelectField
                  label="Program Category"
                  field="category"
                  required={false}
                  options={categoryOptions}
                  formData={formData}
                  errors={errors}
                  updateFormData={updateFormData}
                />
                <SelectField
                  label="Program Type"
                  field="program_type"
                  required={false}
                  options={programTypeOptions}
                  formData={formData}
                  errors={errors}
                  updateFormData={updateFormData}
                />
              </div>

              {/* Message */}
              <TextareaField
                label="Message"
                field="message"
                required
                rows={5}
                placeholder="Tell us about your training needs..."
                formData={formData}
                errors={errors}
                updateFormData={updateFormData}
              />

              {/* Submit */}
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
                    Sending...
                  </>
                ) : (
                  <>
                    <MdSend size={16} />
                    Send Message
                  </>
                )}
              </motion.button>

              <p className="text-center text-slate-400 text-xs mt-3">
                We'll respond within 24 hours · No spam, ever
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ContactForm;
