// @ts-nocheck
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "context/ToastContext";
import useGetPayment from "hooks/payments/useGetPayment";
import useUpdatePayment from "hooks/payments/useUpdatePayment";
import PageHeader from "components/ui/PageHeader";
import InputField from "components/form/InputField";
import Button from "components/ui/buttons/Button";
import SearchableDropdown from "components/form/search/SearchableDropdown";

const SPONSORSHIP_OPTIONS = [
  { value: "self_funded",       label: "Self Funded"  },
  { value: "company_sponsored", label: "Company Sponsored" },
  { value: "government_funded", label: "Government Funded" },
  { value: "scholarship",       label: "Scholarship"  },
];

const METHOD_OPTIONS = [
  { value: "cash",          label: "Cash"          },
  { value: "bank_transfer", label: "Bank Transfer"  },
  { value: "credit_card",   label: "Credit Card"    },
  { value: "cheque",        label: "Cheque"         },
  { value: "online",        label: "Online"         },
];

const STATUS_OPTIONS = [
  { value: "pending",   label: "Pending"   },
  { value: "approved",  label: "Approved"  },
  { value: "cancelled", label: "Cancelled" },
  { value: "refunded",  label: "Refunded"  },
];

const PaymentEditPage = () => {
  const { uid } = useParams<{ uid: string }>();
  const id = uid;
  const navigate = useNavigate();
  const { addToast } = useToast();

  const { payment, loading: loadingPayment, error: loadError } = useGetPayment(id);
  const { updatePayment, loading: updating, error, fieldErrors } = useUpdatePayment();

  const [form, setForm] = useState({
    registration:     "",
    sponsorship_type: "self_funded",
    amount:           "",
    payment_method:   "cash",
    proof:            "",
    cancelled_reason: "",
    cancelled_at:     "",
    approved_by:      "",
    cancelled_by:     "",
  });

  useEffect(() => {
    if (payment) {
      setForm({
        registration:     String(payment.registration ?? ""),
        sponsorship_type: payment.sponsorship_type ?? "self_funded",
        amount:           payment.amount ?? "",
        payment_method:   payment.payment_method ?? "cash",
        proof:            payment.proof ?? "",
        cancelled_reason: payment.cancelled_reason ?? "",
        cancelled_at:     payment.cancelled_at ? payment.cancelled_at.split("T")[0] : "",
        approved_by:      String(payment.approved_by ?? ""),
        cancelled_by:     String(payment.cancelled_by ?? ""),
      });
    }
  }, [payment]);

  const update = (key: string, value: any) =>
    setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      registration:  form.registration  ? Number(form.registration)  : undefined,
      approved_by:   form.approved_by   ? Number(form.approved_by)   : null,
      cancelled_by:  form.cancelled_by  ? Number(form.cancelled_by)  : null,
      proof:         form.proof         || null,
      cancelled_at:  form.cancelled_at  || null,
      cancelled_reason: form.cancelled_reason || undefined,
    };
    const updated = await updatePayment(id, payload);
    if (updated) {
      addToast("Payment updated", "success");
      navigate(`/admin/payments/${id}`);
    }
  };

  if (loadingPayment) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-slate-400">
        Loading payment...
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-red-500">
        {loadError}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <PageHeader
          title="Edit Payment"
          subtitle={<>Editing payment <span className="font-semibold text-navy-700">#{payment?.id}</span></>}
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
            <InputField label="Registration ID" field="registration" type="number" placeholder="e.g. 5" formData={form} errors={fieldErrors} updateFormData={update} />
            <InputField label="Amount"          field="amount"       placeholder="e.g. 1500.00"          formData={form} errors={fieldErrors} updateFormData={update} />
            <SearchableDropdown label="Payment Method"   field="payment_method"   options={METHOD_OPTIONS}       formData={form} errors={fieldErrors} updateFormData={update} placeholder="Select method..."      />
            <SearchableDropdown label="Sponsorship Type" field="sponsorship_type" options={SPONSORSHIP_OPTIONS}  formData={form} errors={fieldErrors} updateFormData={update} placeholder="Select sponsorship..." />
          </div>

          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2 mt-2">
            Cancellation
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Cancelled At"      field="cancelled_at"     type="date" required={false} formData={form} errors={fieldErrors} updateFormData={update} />
            <InputField label="Cancellation Reason" field="cancelled_reason" placeholder="Reason..."  required={false} formData={form} errors={fieldErrors} updateFormData={update} />
            <InputField label="Cancelled By (User ID)" field="cancelled_by" type="number" required={false} formData={form} errors={fieldErrors} updateFormData={update} />
            <InputField label="Approved By (User ID)"  field="approved_by"  type="number" required={false} formData={form} errors={fieldErrors} updateFormData={update} />
          </div>

          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2 mt-2">
            Proof
          </p>
          <InputField label="Proof URL" field="proof" placeholder="https://..." required={false} formData={form} errors={fieldErrors} updateFormData={update} />

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
