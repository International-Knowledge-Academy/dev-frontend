// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import { useToast } from "context/ToastContext";
import useCreateFeedback from "hooks/feedbacks/useCreateFeedback";
import usePrograms from "hooks/programs/usePrograms";
import InputField from "components/form/InputField";
import TextareaField from "components/form/TextareaField";
import SearchableDropdown from "components/form/search/SearchableDropdown";
import Button from "components/ui/buttons/Button";
import PageHeader from "components/ui/PageHeader";

const BASE = "/account-manager/feedbacks";

const StarRatingInput = ({ value, onChange, error }: { value: number; onChange: (v: number) => void; error?: string }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-slate-900 mb-2">
      Rating <span className="text-red-500">*</span>
    </label>
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button key={s} type="button" onClick={() => onChange(s)} className="p-1 transition-transform hover:scale-110 focus:outline-none">
          <Star size={28} className={s <= value ? "text-gold-400 fill-gold-400" : "text-slate-200 fill-slate-200 hover:text-gold-300 hover:fill-gold-300"} />
        </button>
      ))}
      {value > 0 && <span className="ml-2 text-sm font-semibold text-slate-500">{value} / 5</span>}
    </div>
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

const FeedbackCreatePage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { createFeedback, loading, error, fieldErrors } = useCreateFeedback();
  const { programs } = usePrograms({ is_active: true, page_size: 100 });

  const programOptions = [
    { value: "", label: "No Program (General)" },
    ...programs.map((p) => ({ value: p.uid, label: p.name })),
  ];

  const [form, setForm] = useState({ name: "", email: "", position: "", rating: 0, message: "", program_uid: "" });
  const updateFormData = (key: string, value: any) => setForm((p) => ({ ...p, [key]: value }));

  const isFormValid = form.name.trim() !== "" && form.email.trim() !== "" && form.message.trim() !== "" && form.rating >= 1;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name:    form.name,
      email:   form.email,
      message: form.message,
      rating:  form.rating,
      ...(form.position    && { position:    form.position }),
      ...(form.program_uid && { program_uid: form.program_uid }),
    };
    const { feedback: created, fieldErrors: fe, error: ge } = await createFeedback(payload);
    if (created) {
      addToast("Feedback created successfully", "success");
      navigate(BASE);
    } else {
      const firstFieldError = Object.values(fe)[0];
      addToast(firstFieldError ?? ge ?? "Failed to create feedback. Please try again.", "error");
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <PageHeader title="Add Feedback" subtitle="Record a client testimonial or program review" bordered />

        <form onSubmit={handleSubmit} className="px-6 py-5 grid grid-cols-1 gap-4">
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-600">{error}</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Client Name" field="name" placeholder="Ahmad Al-Rashid" formData={form} errors={fieldErrors} updateFormData={updateFormData} />
            <InputField label="Email" field="email" type="email" placeholder="ahmad@example.com" formData={form} errors={fieldErrors} updateFormData={updateFormData} />
            <InputField label="Position / Title" field="position" placeholder="Senior Manager, HR" required={false} formData={form} errors={fieldErrors} updateFormData={updateFormData} />
            <SearchableDropdown label="Program" field="program_uid" options={programOptions} formData={form} errors={fieldErrors} updateFormData={updateFormData} placeholder="Select a program..." required={false} />
          </div>

          <StarRatingInput value={form.rating} onChange={(v) => updateFormData("rating", v)} error={fieldErrors.rating} />

          <TextareaField label="Feedback Message" field="message" placeholder="Share the client's experience and key takeaways from the program..." rows={5} formData={form} errors={fieldErrors} updateFormData={updateFormData} />

          <div className="flex gap-2 border-t border-slate-100 pt-5">
            <Button type="button" text="Cancel" onClick={() => navigate(BASE)} className="flex-1 py-2.5" bgColor="bg-white" textColor="text-slate-600" borderColor="border-slate-200" hoverBgColor="hover:bg-slate-50" hoverTextColor="" hoverBorderColor="" />
            <Button type="submit" variant="primary" text={loading ? "Creating..." : "Create Feedback"} disabled={loading || !isFormValid} className="flex-1 py-2.5" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackCreatePage;
