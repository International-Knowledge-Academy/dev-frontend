// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowBack, MdSave } from "react-icons/md";
import useCreateCertificate from "hooks/certificates/useCreateCertificate";
import useRegistrations from "hooks/registrations/useRegistrations";
import usePrograms from "hooks/programs/usePrograms";
import useTrainers from "hooks/trainers/useTrainers";
import { useToast } from "context/ToastContext";
import InputField from "components/form/InputField";
import SearchableDropdown from "components/form/search/SearchableDropdown";
import SearchableSelect from "components/form/SearchableSelect";
import PdfUploadField from "components/form/filesUpload/PdfUploadField";

const CERTIFICATE_TYPES = [
  { value: "completion",    label: "Completion"    },
  { value: "achievement",   label: "Achievement"   },
  { value: "participation", label: "Participation" },
  { value: "excellence",    label: "Excellence"    },
];

const CertificateCreatePage = () => {
  const navigate     = useNavigate();
  const { addToast } = useToast();
  const { createCertificate, loading, error, fieldErrors } = useCreateCertificate();

  const { registrations, setParams: setRegParams }  = useRegistrations({});
  const { programs }                                = usePrograms({ is_active: true });
  const { trainers, setParams: setTrainersParams }  = useTrainers({});

  const [formData, setFormData] = useState({
    registration:     "",
    program:          "",
    participant_name: "",
    participant_email:"",
    certificate_type: "completion",
    program_name:     "",
    lead_trainer_name:"",
    issued_by:        "International Knowledge Academy IKA",
    status:           "issued",
    certificate_pdf:  "",
  });

  const updateFormData = (field: string, value: any) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleRegistrationChange = (_: string, uid: string) => {
    const reg = registrations.find((r) => r.uid === uid);
    setFormData((prev) => ({
      ...prev,
      registration:      uid,
      participant_name:  reg?.full_name    || prev.participant_name,
      participant_email: reg?.email        || prev.participant_email,
      program:           reg?.program?.uid  || prev.program,
      program_name:      reg?.program?.name || prev.program_name,
    }));
  };

  const handleProgramChange = (_: string, uid: string) => {
    const prog = programs.find((p) => p.uid === uid);
    setFormData((prev) => ({
      ...prev,
      program:      uid,
      program_name: prog?.name || prev.program_name,
    }));
  };

  const registrationOptions = registrations.map((r) => ({
    value: r.uid,
    label: `${r.full_name} — ${r.program?.name ?? "No program"}`,
  }));

  const programOptions  = programs.map((p) => ({ value: p.uid, label: p.name }));
  const trainerOptions  = trainers.map((t) => ({ value: t.name, label: t.name }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = Object.fromEntries(
      Object.entries(formData).filter(([, v]) => v !== "")
    );
    const result = await createCertificate(payload as any);
    if (result) {
      addToast("Certificate created successfully", "success");
      navigate("/account-manager/certificates");
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100">
          <h1 className="text-base font-bold text-navy-800 leading-snug">Issue Certificate</h1>
          <p className="text-xs text-slate-400 mt-0.5">Create a new certificate for a participant</p>
        </div>

        <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-5 space-y-4">
          {error && (
            <div className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          {/* Link */}
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">
            Link (Optional)
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SearchableDropdown
              label="Registration"
              field="registration"
              options={registrationOptions}
              formData={formData}
              errors={fieldErrors}
              updateFormData={handleRegistrationChange}
              placeholder="Search by participant name..."
              required={false}
              onSearchChange={(q) => setRegParams({ search: q || undefined })}
            />
            <SearchableDropdown
              label="Program"
              field="program"
              options={programOptions}
              formData={formData}
              errors={fieldErrors}
              updateFormData={handleProgramChange}
              placeholder="Select program..."
              required={false}
            />
          </div>

          {/* Participant */}
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2 pt-2">
            Participant
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Participant Name" field="participant_name"  formData={formData} errors={fieldErrors} updateFormData={updateFormData} placeholder="Full name" required />
            <InputField label="Email"            field="participant_email" formData={formData} errors={fieldErrors} updateFormData={updateFormData} placeholder="email@example.com" required />
          </div>

          {/* Program */}
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2 pt-2">
            Program
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Program Name" field="program_name" formData={formData} errors={fieldErrors} updateFormData={updateFormData} placeholder="Program title" required />
            <SearchableDropdown
              label="Lead Trainer"
              field="lead_trainer_name"
              options={trainerOptions}
              formData={formData}
              errors={fieldErrors}
              updateFormData={(_, name) => updateFormData("lead_trainer_name", name)}
              placeholder="Search trainer..."
              required={false}
              onSearchChange={(q) => setTrainersParams({ search: q || undefined })}
            />
            <InputField label="Issued By" field="issued_by" formData={formData} errors={fieldErrors} updateFormData={updateFormData} placeholder="Issuing authority" required={false} />
          </div>

          {/* Certificate */}
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2 pt-2">
            Certificate
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SearchableSelect
              label="Certificate Type"
              field="certificate_type"
              options={CERTIFICATE_TYPES}
              formData={formData}
              errors={fieldErrors}
              updateFormData={updateFormData}
              placeholder="Select type..."
            />
          </div>
          <PdfUploadField label="Certificate PDF" folder="certificates/pdfs" displayUrl={formData.certificate_pdf} onChange={(url) => updateFormData("certificate_pdf", url)} />

          <div className="flex gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate("/account-manager/certificates")}
              className="flex-1 rounded-md lg:rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition flex items-center justify-center gap-2"
            >
              <MdArrowBack size={16} /> Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.participant_name.trim() || !formData.program_name.trim()}
              className="flex-1 rounded-md lg:rounded-lg bg-navy-800 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 disabled:opacity-60 transition flex items-center justify-center gap-2"
            >
              <MdSave size={16} />
              {loading ? "Creating..." : "Issue Certificate"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CertificateCreatePage;
