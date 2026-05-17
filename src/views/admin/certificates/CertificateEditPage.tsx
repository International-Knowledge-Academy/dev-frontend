// @ts-nocheck
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdArrowBack, MdSave } from "react-icons/md";
import useCertificate from "hooks/certificates/useCertificate";
import useUpdateCertificate from "hooks/certificates/useUpdateCertificate";
import { useToast } from "context/ToastContext";
import InputField from "components/form/InputField";
import SelectField from "components/form/SelectField";
import PdfUploadField from "components/form/filesUpload/PdfUploadField";


const CERTIFICATE_TYPES = [
  { value: "completion",    label: "Completion"    },
  { value: "achievement",   label: "Achievement"   },
  { value: "participation", label: "Participation" },
  { value: "excellence",    label: "Excellence"    },
];

const STATUSES = [
  { value: "issued",  label: "Issued"  },
  { value: "revoked", label: "Revoked" },
];

const CertificateEditPage = () => {
  const { uid }      = useParams<{ uid: string }>();
  const navigate     = useNavigate();
  const { addToast } = useToast();

  const { certificate, loading: fetching }                          = useCertificate(uid);
  const { updateCertificate, loading: saving, error, fieldErrors }  = useUpdateCertificate();

  const [formData, setFormData] = useState({
    participant_name:  "",
    participant_email: "",
    certificate_type:  "completion",
    program_name:      "",
    lead_trainer_name: "",
    issued_by:         "International Knowledge Academy IKA",
    status:            "issued",
    certificate_pdf:   "",
  });

  useEffect(() => {
    if (!certificate) return;
    setFormData({
      participant_name:  certificate.participant_name  ?? "",
      participant_email: certificate.participant_email ?? "",
      certificate_type:  certificate.certificate_type  ?? "completion",
      program_name:      certificate.program_name      ?? "",
      lead_trainer_name: certificate.lead_trainer_name ?? "",
      issued_by:         certificate.issued_by         ?? "International Knowledge Academy IKA",
      status:            certificate.status            ?? "issued",
      certificate_pdf:   certificate.certificate_pdf   ?? "",
    });
  }, [certificate]);

  const updateFormData = (field: string, value: any) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await updateCertificate(uid, formData);
    if (result) {
      addToast("Certificate updated successfully", "success");
      navigate(`/admin/certificates/${uid}`);
    }
  };

  if (fetching) {
    return <div className="flex items-center justify-center py-20 text-sm text-slate-400">Loading certificate...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100">
          <h1 className="text-base font-bold text-navy-800 leading-snug">Edit Certificate</h1>
          <p className="text-xs text-slate-400 mt-0.5 font-mono">{certificate?.certificate_number}</p>
        </div>

        <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-5 space-y-4">
          {error && (
            <div className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          {/* Participant */}
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">
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
            <InputField label="Program Name"  field="program_name"      formData={formData} errors={fieldErrors} updateFormData={updateFormData} placeholder="Program title" required />
            <InputField label="Lead Trainer"  field="lead_trainer_name" formData={formData} errors={fieldErrors} updateFormData={updateFormData} placeholder="Trainer full name" />
            <InputField label="Issued By"     field="issued_by"         formData={formData} errors={fieldErrors} updateFormData={updateFormData} placeholder="Issuing authority" />
          </div>

          {/* Certificate */}
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2 pt-2">
            Certificate
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField label="Certificate Type" field="certificate_type" options={CERTIFICATE_TYPES} formData={formData} errors={fieldErrors} updateFormData={updateFormData} required />
            <SelectField label="Status"           field="status"           options={STATUSES}          formData={formData} errors={fieldErrors} updateFormData={updateFormData} required />
          </div>
          <PdfUploadField label="Certificate PDF" folder="certificates/pdfs" displayUrl={formData.certificate_pdf} onChange={(url) => updateFormData("certificate_pdf", url)} />

          <div className="flex gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate(`/admin/certificates/${uid}`)}
              className="flex-1 rounded-md lg:rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition flex items-center justify-center gap-2"
            >
              <MdArrowBack size={16} /> Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-md lg:rounded-lg bg-navy-800 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 disabled:opacity-60 transition flex items-center justify-center gap-2"
            >
              <MdSave size={16} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CertificateEditPage;
