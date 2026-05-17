// @ts-nocheck
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FileText, Upload, X, ExternalLink } from "lucide-react";
import { useToast } from "context/ToastContext";
import useGetPayment from "hooks/payments/useGetPayment";
import useUpdatePayment from "hooks/payments/useUpdatePayment";
import usePresignedUpload from "hooks/storage/usePresignedUpload";
import PageHeader from "components/ui/PageHeader";
import InputField from "components/form/InputField";
import Button from "components/ui/buttons/Button";
import SearchableDropdown from "components/form/search/SearchableDropdown";
import Loading from "components/loading/Loading";

const SPONSORSHIP_OPTIONS = [
  { value: "self_funded",       label: "Self Funded"      },
  { value: "company_sponsored", label: "Company Sponsored" },
  { value: "government_funded", label: "Government Funded" },
  { value: "scholarship",       label: "Scholarship"       },
];

const METHOD_OPTIONS = [
  { value: "cash",          label: "Cash"         },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "credit_card",   label: "Credit Card"   },
  { value: "cheque",        label: "Cheque"        },
  { value: "online",        label: "Online"        },
];

const PdfUpload = ({ value, onChange }) => {
  const { upload, uploading, progress, error } = usePresignedUpload();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    const result = await upload(file, { folder: "payments/proofs", file_type: "pdf" });
    if (result) onChange(result.public_url);
  };

  const fileName = value ? value.split("/").pop() : null;

  return (
    <div>
      <label className="block text-sm font-medium text-navy-800 mb-2">Payment Proof</label>
      {value ? (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-slate-200 bg-slate-50">
          <FileText size={18} className="text-navy-500 flex-shrink-0" />
          <span className="text-sm text-navy-800 truncate flex-1" title={fileName}>{fileName}</span>
          <a href={value} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-navy-600 transition flex-shrink-0">
            <ExternalLink size={14} />
          </a>
          <button type="button" onClick={() => { onChange(""); inputRef.current?.click(); }}
            className="text-slate-400 hover:text-navy-600 transition flex-shrink-0" title="Replace">
            <Upload size={14} />
          </button>
          <button type="button" onClick={() => onChange("")}
            className="text-slate-400 hover:text-red-500 transition flex-shrink-0" title="Remove">
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full h-20 rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-1.5 text-slate-400 hover:border-navy-300 hover:text-navy-500 transition bg-slate-50 disabled:opacity-60"
        >
          <FileText size={20} />
          <span className="text-xs font-medium">Upload Proof PDF</span>
          <span className="text-[10px] text-slate-300">PDF files only</span>
        </button>
      )}
      {uploading && (
        <div className="mt-2 space-y-1">
          <div className="h-1 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full bg-navy-500 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-slate-400 text-center">Uploading {progress}%</p>
        </div>
      )}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={handleChange} />
    </div>
  );
};

const PaymentEditPage = () => {
  const { uid } = useParams<{ uid: string }>();
  const id = uid;
  const navigate = useNavigate();
  const { addToast } = useToast();

  const { payment, loading: loadingPayment, error: loadError } = useGetPayment(id);
  const { updatePayment, loading: updating, error, fieldErrors } = useUpdatePayment();

  const [form, setForm] = useState({
    sponsorship_type: "self_funded",
    amount:           "",
    payment_method:   "cash",
    proof:            "",
  });

  useEffect(() => {
    if (payment) {
      setForm({
        sponsorship_type: payment.sponsorship_type ?? "self_funded",
        amount:           payment.amount            ?? "",
        payment_method:   payment.payment_method    ?? "cash",
        proof:            payment.proof              ?? "",
      });
    }
  }, [payment]);

  const update = (key: string, value: any) =>
    setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, proof: form.proof || null };
    const updated = await updatePayment(id, payload);
    if (updated) {
      addToast("Payment updated", "success");
      navigate(`/admin/payments/${id}`);
    }
  };

  if (loadingPayment) return <Loading text="Loading payment..." />;
  if (loadError) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-red-500">{loadError}</div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <PageHeader
          title="Edit Payment"
          subtitle={<>Editing payment <span className="font-semibold text-navy-700">#{payment?.uid?.slice(0, 8)}</span></>}
          bordered
        />

        <form onSubmit={handleSubmit} className="px-6 py-5 grid grid-cols-1 gap-4">
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-600">
              {error}
            </div>
          )}

          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">
            Payment Details
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Amount"
              field="amount"
              placeholder="e.g. 1500.00"
              formData={form}
              errors={fieldErrors}
              updateFormData={update}
            />
            <SearchableDropdown
              label="Payment Method"
              field="payment_method"
              options={METHOD_OPTIONS}
              formData={form}
              errors={fieldErrors}
              updateFormData={update}
              placeholder="Select method..."
            />
            <SearchableDropdown
              label="Sponsorship Type"
              field="sponsorship_type"
              options={SPONSORSHIP_OPTIONS}
              formData={form}
              errors={fieldErrors}
              updateFormData={update}
              placeholder="Select sponsorship..."
            />
          </div>

          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2 mt-2">
            Proof
          </p>
          <PdfUpload value={form.proof} onChange={(url) => update("proof", url)} />

          <div className="flex gap-2 border-t border-slate-100 pt-4">
            <Button
              type="button"
              text="Cancel"
              onClick={() => navigate(`/admin/payments/${id}`)}
              className="flex-1"
              bgColor="bg-white"
              textColor="text-slate-600"
              borderColor="border-slate-200"
              hoverBgColor="hover:bg-slate-50"
              hoverTextColor=""
              hoverBorderColor=""
            />
            <Button
              type="submit"
              variant="primary"
              text={updating ? "Saving..." : "Save Changes"}
              disabled={updating}
              className="flex-1"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentEditPage;
